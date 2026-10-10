import {
  DOCUMENT,
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';

import {
  ApiClient,
  apiErrorMessage,
  isHttpStatus,
} from '../../../../core/api/api-client';
import { SharedMap, SharedMapState } from '../../../../core/api/api.models';

const POLL_MS = 4000;
const MAX_POLL_MS = 60000;

interface PendingChange {
  patchId: number;
  /** `undefined` means the key is being removed. */
  value: unknown;
}

/** Codes are case- and dash-insensitive (k7qx92pm == K7QX-92PM). */
export function sameMapCode(a: string, b: string): boolean {
  const normalize = (code: string) => code.replace(/-/g, '').toUpperCase();
  return normalize(a) === normalize(b);
}

/**
 * Keeps one shared map in sync with the API: polls for changes (paused while
 * the tab is hidden) and sends local changes as patches of top-level keys,
 * shown immediately and confirmed by the server's response.
 */
@Injectable()
export class SharedMapSession {
  private readonly api = inject(ApiClient);
  private readonly document = inject(DOCUMENT);

  private readonly map = signal<SharedMap | null>(null);
  private readonly pending = signal<ReadonlyMap<string, PendingChange>>(
    new Map()
  );
  private readonly now = signal(Date.now());

  readonly code = signal<string | null>(null);
  readonly loading = signal(false);
  /** The map does not exist (any more); polling has stopped. */
  readonly expired = signal(false);
  readonly error = signal<string | null>(null);

  /** Server state with local changes that are still on their way applied on top. */
  readonly state = computed<SharedMapState | null>(() => {
    const map = this.map();
    if (!map) return null;
    const pending = this.pending();
    if (!pending.size) return map.state;
    const state = { ...map.state };
    for (const [key, { value }] of pending) {
      if (value === undefined) delete state[key];
      else state[key] = value;
    }
    return state;
  });

  readonly expiresAt = computed(() => this.map()?.expiresAt ?? null);
  readonly remainingMs = computed(() => {
    const expiresAt = this.expiresAt();
    return expiresAt ? Math.max(0, Date.parse(expiresAt) - this.now()) : null;
  });

  private pollTimer: ReturnType<typeof setTimeout> | undefined;
  private clockTimer: ReturnType<typeof setInterval> | undefined;
  private pollSub: Subscription | undefined;
  private pollDelay = POLL_MS;
  private patchSeq = 0;

  private readonly onVisibilityChange = () => {
    if (this.document.visibilityState === 'visible') this.poll();
    else this.stopPolling();
  };

  constructor() {
    this.document.addEventListener('visibilitychange', this.onVisibilityChange);
    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener(
        'visibilitychange',
        this.onVisibilityChange
      );
      this.close();
    });
  }

  /** Starts following the map with this code (no-op if it is already open). */
  open(code: string): void {
    const current = this.code();
    if (current && sameMapCode(current, code)) return;
    this.reset();
    this.code.set(code);
    this.loading.set(true);
    this.startClock();
    this.poll();
  }

  /** Stops following the map; the last known state is dropped. */
  close(): void {
    this.reset();
  }

  /** Creates a map with the given state and starts following it. */
  async create(state: SharedMapState): Promise<SharedMap> {
    const map = await firstValueFrom(this.api.createSharedMap(state));
    this.reset();
    this.code.set(map.code);
    this.map.set(map);
    this.startClock();
    this.schedulePoll();
    return map;
  }

  /** Applies the change locally right away and sends it to the server. */
  update(set: SharedMapState, remove: string[]): void {
    const code = this.code();
    if (!code || this.expired()) return;
    const keys = [...Object.keys(set), ...remove];
    if (!keys.length) return;

    const patchId = ++this.patchSeq;
    this.pending.update((pending) => {
      const next = new Map(pending);
      for (const [key, value] of Object.entries(set))
        next.set(key, { patchId, value });
      for (const key of remove) next.set(key, { patchId, value: undefined });
      return next;
    });

    this.api
      .patchSharedMap(code, {
        set: Object.keys(set).length ? set : undefined,
        remove: remove.length ? remove : undefined,
      })
      .subscribe({
        next: (map) => {
          this.apply(map);
          this.settle(keys, patchId);
        },
        error: (err: unknown) => {
          this.settle(keys, patchId);
          this.handleError(err);
        },
      });
  }

  private apply(map: SharedMap): void {
    const current = this.map();
    if (!current || map.version > current.version) this.map.set(map);
  }

  /** Drops pending changes of a finished patch, unless a newer patch changed the key again. */
  private settle(keys: string[], patchId: number): void {
    this.pending.update((pending) => {
      const next = new Map(pending);
      for (const key of keys)
        if (next.get(key)?.patchId === patchId) next.delete(key);
      return next;
    });
  }

  private poll(): void {
    this.stopPolling();
    const code = this.code();
    if (!code || this.expired()) return;
    // Resumed by the visibilitychange listener.
    if (this.document.visibilityState === 'hidden') return;

    this.pollSub = this.api.sharedMap(code, this.map()?.version).subscribe({
      next: (map) => {
        if (map) this.apply(map);
        this.loading.set(false);
        this.error.set(null);
        this.pollDelay = POLL_MS;
        this.schedulePoll();
      },
      error: (err: unknown) => {
        this.loading.set(false);
        if (isHttpStatus(err, 429)) {
          this.pollDelay = Math.min(this.pollDelay * 2, MAX_POLL_MS);
        } else {
          this.handleError(err);
        }
        this.schedulePoll();
      },
    });
  }

  private handleError(err: unknown): void {
    if (isHttpStatus(err, 404)) {
      this.expired.set(true);
      this.stopPolling();
      this.stopClock();
    } else if (!isHttpStatus(err, 429)) {
      this.error.set(apiErrorMessage(err));
    }
  }

  private schedulePoll(): void {
    clearTimeout(this.pollTimer);
    if (this.expired()) return;
    this.pollTimer = setTimeout(() => this.poll(), this.pollDelay);
  }

  private stopPolling(): void {
    clearTimeout(this.pollTimer);
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }

  private startClock(): void {
    this.stopClock();
    this.now.set(Date.now());
    this.clockTimer = setInterval(() => this.now.set(Date.now()), 1000);
  }

  private stopClock(): void {
    clearInterval(this.clockTimer);
  }

  private reset(): void {
    this.stopPolling();
    this.stopClock();
    this.code.set(null);
    this.map.set(null);
    this.pending.set(new Map());
    this.loading.set(false);
    this.expired.set(false);
    this.error.set(null);
    this.pollDelay = POLL_MS;
  }
}
