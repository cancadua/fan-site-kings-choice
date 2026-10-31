import { ViewportScroller } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/**
 * Scrolls to the top when the page (path) changes. Query-only navigations, such as
 * switching tabs inside a page, keep the current scroll position.
 */
export function provideScrollToTopOnNavigation(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const viewport = inject(ViewportScroller);
    let lastPath = '';

    router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      const path = event.urlAfterRedirects.split(/[?#]/)[0];
      if (path !== lastPath) viewport.scrollToPosition([0, 0]);
      lastPath = path;
    });
  });
}
