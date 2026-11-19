import { ViewportScroller } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

const pathOf = (url: string): string => url.split(/[?#]/)[0];

/**
 * Lets a navigation keep the scroll position although its path changes, e.g. switching
 * tabs, where every tab has a URL of its own.
 */
@Injectable({ providedIn: 'root' })
export class ScrollPositionKeeper {
  private keptPath: string | null = null;

  /** The next navigation, if it goes to this URL, does not scroll to the top. */
  keepFor(url: string): void {
    this.keptPath = pathOf(url);
  }

  /** Whether this navigation should keep the position. Each request is used only once. */
  consume(path: string): boolean {
    const keep = this.keptPath === path;
    this.keptPath = null;
    return keep;
  }
}

/**
 * Scrolls to the top when the page (path) changes. Query-only navigations and tab
 * switches (see `ScrollPositionKeeper`) keep the current scroll position.
 */
export function provideScrollToTopOnNavigation(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const viewport = inject(ViewportScroller);
    const keeper = inject(ScrollPositionKeeper);
    let lastPath = '';

    router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      const path = pathOf(event.urlAfterRedirects);
      const keep = keeper.consume(path);
      if (path !== lastPath && !keep) viewport.scrollToPosition([0, 0]);
      lastPath = path;
    });
  });
}
