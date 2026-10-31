import { Injectable, computed, signal } from '@angular/core';

/** Tracks API calls that are taking suspiciously long (e.g. the host waking from sleep). */
@Injectable({ providedIn: 'root' })
export class ApiStatusService {
  private readonly slowCount = signal(0);

  /** True while at least one API request has been pending longer than the slow threshold. */
  readonly waking = computed(() => this.slowCount() > 0);

  markSlow(): void {
    this.slowCount.update((n) => n + 1);
  }

  markDone(): void {
    this.slowCount.update((n) => Math.max(0, n - 1));
  }
}
