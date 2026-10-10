import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../core/api/api-client';
import { MyAlliance } from '../../core/api/api.models';
import { isManagerRole } from './alliance-sections';

const SELECTED_KEY = 'kc_selected_alliance';

/** The signed-in user's alliances (any role), and which one is currently selected. */
@Injectable({ providedIn: 'root' })
export class AllianceStateService {
  private readonly api = inject(ApiClient);

  private readonly alliancesSignal = signal<MyAlliance[]>([]);
  private readonly selectedIdSignal = signal<string | null>(
    this.loadSelectedId()
  );
  private readonly loadingSignal = signal(false);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private inFlight: Promise<void> | null = null;

  readonly alliances = this.alliancesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly selected = computed(() => {
    const alliances = this.alliancesSignal();
    return (
      alliances.find((a) => a.id === this.selectedIdSignal()) ??
      alliances[0] ??
      null
    );
  });

  /** True when the user is Owner or Leader of the selected alliance. */
  readonly isManager = computed(() => isManagerRole(this.selected()?.myRole));

  /** Reloads the alliance list; concurrent calls share one request. */
  load(): Promise<void> {
    this.inFlight ??= this.fetch().finally(() => (this.inFlight = null));
    return this.inFlight;
  }

  /** Loads the alliance list unless it is already loaded. */
  ensureLoaded(): Promise<void> {
    return this.loadedSignal() ? Promise.resolve() : this.load();
  }

  select(id: string): void {
    this.selectedIdSignal.set(id);
    try {
      localStorage.setItem(SELECTED_KEY, id);
    } catch {
      // Storage unavailable; the selection just won't persist.
    }
  }

  async create(name: string): Promise<void> {
    const created = await firstValueFrom(this.api.createAlliance(name));
    await this.load();
    this.select(created.id);
  }

  reset(): void {
    this.alliancesSignal.set([]);
    this.loadedSignal.set(false);
    this.errorSignal.set(null);
  }

  private async fetch(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      this.alliancesSignal.set(await firstValueFrom(this.api.myAlliances()));
      this.loadedSignal.set(true);
    } catch (err) {
      this.errorSignal.set(apiErrorMessage(err));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private loadSelectedId(): string | null {
    try {
      return localStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  }
}
