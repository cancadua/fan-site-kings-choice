import { Injectable, signal } from '@angular/core';

/**
 * Opens the site-wide search from anywhere (header button, home hero, keyboard
 * shortcut). The header renders the dialog; its code loads on first use.
 */
@Injectable({ providedIn: 'root' })
export class SiteSearch {
  /** Becomes true on first use, which loads the dialog's code. */
  readonly loaded = signal(false);
  readonly isOpen = signal(false);
  /** "Ctrl K" or "⌘K", set once the browser is known. */
  readonly shortcutLabel = signal('Ctrl K');

  open(): void {
    this.loaded.set(true);
    this.isOpen.set(true);
  }

  /** Browser only: shows ⌘K on Apple devices. */
  detectPlatform(): void {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) {
      this.shortcutLabel.set('⌘K');
    }
  }
}
