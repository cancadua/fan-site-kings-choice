import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionService } from '../auth/session.service';

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

const SCRIPT_URL = 'https://cloud.umami.is/script.js';
const COUNTED_DOMAINS = 'kc-lords-tavern.com,www.kc-lords-tavern.com';

/** Pages where a password is typed or the login token is in use; third-party code must never run there. */
const PRIVATE_PATHS = ['/login', '/alliance'];

function isPrivate(url: string): boolean {
  const path = url.split(/[?#]/)[0];
  return PRIVATE_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Privacy-friendly analytics (Umami): no cookies, no IP storage, no personal data.
 * Does nothing until `environment.analyticsWebsiteId` is set, and only counts
 * visits on the production domains (never localhost).
 *
 * The script is third-party code with full page access, and the login token sits in
 * localStorage, so it only loads on public pages for signed-out visitors.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loaded = false;

  init(): void {
    const id = environment.analyticsWebsiteId;
    if (!id || !this.isBrowser) return;

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart && this.loaded && isPrivate(e.url)) {
        // A running script can't be unloaded, so reload the page; the fresh page won't load it.
        this.doc.location.assign(e.url);
      } else if (
        e instanceof NavigationEnd &&
        !this.loaded &&
        !isPrivate(e.urlAfterRedirects) &&
        !this.session.isLoggedIn()
      ) {
        this.load(id);
      }
    });
  }

  /** Records a named action, e.g. `track('kofi-click', { place: 'footer' })`. */
  track(event: string, data?: Record<string, string | number>): void {
    this.doc.defaultView?.umami?.track(event, data);
  }

  private load(id: string): void {
    this.loaded = true;
    const script = this.doc.createElement('script');
    script.defer = true;
    script.src = SCRIPT_URL;
    script.dataset['websiteId'] = id;
    script.dataset['domains'] = COUNTED_DOMAINS;
    // Respect the browser's Do Not Track setting.
    script.dataset['doNotTrack'] = 'true';
    // Shared map codes live in the query string; keep them out of the stats.
    script.dataset['excludeSearch'] = 'true';
    this.doc.head.appendChild(script);
  }
}
