import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const TOKEN_KEY = 'kc_alliance_token';

/** Reads the `exp` claim (seconds) from a JWT without validating it; the API does the real validation. */
function tokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = (JSON.parse(json) as { exp?: unknown }).exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const expiry = tokenExpiry(token);
  return expiry === null || expiry <= Date.now();
}

/** Holds the API JWT. Stored in localStorage so a refresh keeps the user signed in. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /**
   * Storage is touched only in the browser. Node 25+ has its own global `localStorage`,
   * so reading it while prerendering logs a warning (and could share data between pages).
   */
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly tokenSignal = signal<string | null>(this.load());

  readonly token = this.tokenSignal.asReadonly();

  /** A plain function, not a computed: expiry depends on the clock, which signals don't track. */
  isLoggedIn(): boolean {
    const token = this.tokenSignal();
    if (token === null) return false;
    if (isExpired(token)) {
      this.clear();
      return false;
    }
    return true;
  }

  setToken(token: string): void {
    this.tokenSignal.set(token);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable (private mode); the session just won't survive a reload.
    }
  }

  clear(): void {
    this.tokenSignal.set(null);
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore.
    }
  }

  private load(): string | null {
    if (!this.isBrowser) return null;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token && !isExpired(token) ? token : null;
    } catch {
      return null;
    }
  }
}
