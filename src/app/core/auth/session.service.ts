import { Injectable, computed, signal } from '@angular/core';

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
  private readonly tokenSignal = signal<string | null>(this.load());

  readonly token = this.tokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return token !== null && !isExpired(token);
  });

  setToken(token: string): void {
    this.tokenSignal.set(token);
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable (private mode); the session just won't survive a reload.
    }
  }

  clear(): void {
    this.tokenSignal.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore.
    }
  }

  private load(): string | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token && !isExpired(token) ? token : null;
    } catch {
      return null;
    }
  }
}
