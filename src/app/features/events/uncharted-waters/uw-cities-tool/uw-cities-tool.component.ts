import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UwCitiesContainer } from './uw-cities-container/uw-cities-container.component';
import { uwCities } from '../../../../core/constants/uw-cities';
import { City } from './uw-cities-container/uw-cities-container.schema';
import { apiErrorMessage } from '../../../../core/api/api-client';
import { SharedMapState } from '../../../../core/api/api.models';
import { SharedMapSession } from './shared-map-session.service';

/** Query param that holds the shared map code on the events page. */
export const SHARED_MAP_PARAM = 'map';

const CITY_KEY_PREFIX = 'city:';

type CityList = 'populated' | 'vacant';

/** One state key per city, so people marking different cities never overwrite each other. */
interface SharedCity {
  vacant: boolean;
  /** When the city was marked vacant (ms), to keep the vacant list in order. */
  at: number;
}

function cityKey(city: City): string {
  return CITY_KEY_PREFIX + (city.code ?? city.name);
}

function sharedCity(at: number): SharedCity {
  return { vacant: true, at };
}

/** Keys of vacant cities in the order they were marked. */
function vacantKeys(state: SharedMapState): string[] {
  return Object.entries(state)
    .filter(
      (entry): entry is [string, SharedCity] =>
        entry[0].startsWith(CITY_KEY_PREFIX) &&
        typeof entry[1] === 'object' &&
        entry[1] !== null &&
        (entry[1] as Partial<SharedCity>).vacant === true
    )
    .sort(([, a], [, b]) => (a.at ?? 0) - (b.at ?? 0))
    .map(([key]) => key);
}

function formatRemaining(ms: number): string {
  const total = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${Math.floor(total / 3600)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
}

@Component({
  selector: 'app-uw-cities-tool',
  imports: [UwCitiesContainer],
  templateUrl: './uw-cities-tool.component.html',
  styleUrl: './uw-cities-tool.component.scss',
  providers: [SharedMapSession],
})
export class UwCitiesToolComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly shared = inject(SharedMapSession);

  position: NonNullable<City['position']>[] = [];
  counter = 0;

  nonEmpty = signal<City[]>(
    Object.values(uwCities).reduce((acc: City[], value) => {
      if (value.length > 0) {
        acc.push(...value.map((city) => ({ ...city })));
      }
      return acc;
    }, [])
  );

  empty = signal<City[]>([]);

  mapExpanded = signal(false);

  full = computed(() => {
    return [...this.nonEmpty(), ...this.empty()];
  });

  // Shared map
  private readonly mapCode = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get(SHARED_MAP_PARAM))
    ),
    { initialValue: null }
  );
  /** Keys of the vacant cities as last exchanged with the shared map. */
  private syncedVacant = new Set<string>();

  sharing = signal(false);
  shareError = signal<string | null>(null);
  copied = signal(false);

  /** List whose names were just copied, for the button's feedback. */
  copiedList = signal<CityList | null>(null);
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  readonly shareLink = computed(() => {
    const code = this.shared.code();
    if (!code) return null;
    const path = this.location.prepareExternalUrl(`/uncharted-waters/${code}`);
    return new URL(path, window.location.origin).href;
  });

  readonly remaining = computed(() => {
    const ms = this.shared.remainingMs();
    return ms === null ? null : formatRemaining(ms);
  });

  constructor() {
    effect(() => {
      const code = this.mapCode();
      untracked(() => {
        if (code) this.shared.open(code);
        else this.shared.close();
      });
    });

    // Shared state -> lists
    effect(() => {
      const state = this.shared.state();
      if (state) untracked(() => this.showVacant(vacantKeys(state)));
    });

    // List changes -> shared state
    effect(() => {
      const empty = this.empty();
      untracked(() => this.pushVacant(empty));
    });
  }

  toggleMap(): void {
    this.mapExpanded.update((expanded) => !expanded);
  }

  isPopulated(city: City): boolean {
    return this.nonEmpty().includes(city);
  }

  /** Uploads the current lists as a new shared map and opens its URL. */
  async share(): Promise<void> {
    if (this.sharing()) return;
    this.sharing.set(true);
    this.shareError.set(null);
    try {
      const now = Date.now();
      const state = Object.fromEntries(
        this.empty().map((city, i) => [cityKey(city), sharedCity(now + i)])
      );
      const created = await this.shared.create(state);
      this.copied.set(false);
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [SHARED_MAP_PARAM]: created.code },
        queryParamsHandling: 'merge',
      });
    } catch (err) {
      this.shareError.set(apiErrorMessage(err));
    } finally {
      this.sharing.set(false);
    }
  }

  /** Back to a local-only map; the lists keep their current state. */
  async leave(): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [SHARED_MAP_PARAM]: null },
      queryParamsHandling: 'merge',
    });
  }

  async copyLink(): Promise<void> {
    const link = this.shareLink();
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      this.copied.set(true);
    } catch {
      // Clipboard blocked (e.g. insecure context); the link stays selectable.
      this.copied.set(false);
    }
  }

  /** Copies one list as e.g. "EMPTY: Alexandria, Tunis" (names A–Z) for the game chat. */
  async copyCities(list: CityList): Promise<void> {
    const cities = list === 'populated' ? this.nonEmpty() : this.empty();
    const names = cities
      .map((city) => city.name)
      .sort((a, b) => a.localeCompare(b))
      .join(', ');
    const label = list === 'populated' ? 'NOT EMPTY' : 'EMPTY';
    try {
      await navigator.clipboard.writeText(`${label}: ${names}`);
      this.copiedList.set(list);
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copiedList.set(null), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context).
      this.copiedList.set(null);
    }
  }

  /** Moves cities between the lists to match the shared state, keeping the current order where possible. */
  private showVacant(keys: string[]): void {
    this.syncedVacant = new Set(keys);
    const vacant = this.syncedVacant;
    const current = this.empty();
    if (
      current.length === vacant.size &&
      current.every((city) => vacant.has(cityKey(city)))
    )
      return;

    const byKey = new Map(this.full().map((city) => [cityKey(city), city]));
    const stillVacant = current.filter((city) => vacant.has(cityKey(city)));
    const newlyVacant = keys
      .filter((key) => !current.some((city) => cityKey(city) === key))
      .map((key) => byKey.get(key))
      .filter((city): city is City => !!city);
    const populated = this.nonEmpty().filter(
      (city) => !vacant.has(cityKey(city))
    );
    const nowPopulated = current.filter((city) => !vacant.has(cityKey(city)));

    for (const city of [...stillVacant, ...newlyVacant]) city.color = 'red';
    for (const city of [...populated, ...nowPopulated]) city.color = 'green';
    this.nonEmpty.set([...populated, ...nowPopulated]);
    this.empty.set([...stillVacant, ...newlyVacant]);
  }

  /** Sends the cities that changed list since the last sync. */
  private pushVacant(empty: City[]): void {
    if (!this.shared.state() || this.shared.expired()) return;
    const keys = new Set(empty.map(cityKey));
    const now = Date.now();
    const set: SharedMapState = {};
    let i = 0;
    for (const key of keys)
      if (!this.syncedVacant.has(key)) set[key] = sharedCity(now + i++);
    const remove = [...this.syncedVacant].filter((key) => !keys.has(key));
    this.syncedVacant = keys;
    this.shared.update(set, remove);
  }

  logClickPosition(event: MouseEvent) {
    const mapEl = event.currentTarget as HTMLElement;
    const rect = mapEl.getBoundingClientRect();
    this.position.push({
      left: (((event.clientX - rect.left) / rect.width) * 100).toString() + '%',
      top: (((event.clientY - rect.top) / rect.height) * 100).toString() + '%',
    });
    this.counter++;
    console.log(this.position);
  }
}
