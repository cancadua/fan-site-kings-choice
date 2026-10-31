import { Injectable, signal } from '@angular/core';

/**
 * Intro scenes (magic book, warriors) should only play when the viewer switches
 * events on the Events page, not when they arrive on it. The page enables them
 * on the first switch and resets them when it is left.
 */
@Injectable({ providedIn: 'root' })
export class IntroPlayback {
  private readonly allowed = signal(false);
  readonly enabled = this.allowed.asReadonly();

  enable(): void {
    this.allowed.set(true);
  }

  reset(): void {
    this.allowed.set(false);
  }
}
