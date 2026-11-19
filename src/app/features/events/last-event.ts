const LAST_EVENT_KEY = 'kc.lastEvent';

// Remembers the last viewed event; storage can be blocked, so failures are ignored.
export function loadLastEvent(): string | null {
  try {
    return localStorage.getItem(LAST_EVENT_KEY);
  } catch {
    return null;
  }
}

export function saveLastEvent(event: string): void {
  try {
    localStorage.setItem(LAST_EVENT_KEY, event);
  } catch {
    // ignore
  }
}
