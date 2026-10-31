import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

const SCRIPT_URL = 'https://cloud.umami.is/script.js';
const COUNTED_DOMAINS = 'kc-lords-tavern.com,www.kc-lords-tavern.com';

/**
 * Privacy-friendly analytics (Umami): no cookies, no IP storage, no personal data.
 * Does nothing until `environment.analyticsWebsiteId` is set, and only counts
 * visits on the production domains (never localhost).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    const id = environment.analyticsWebsiteId;
    if (!id || !this.isBrowser) return;

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

  /** Records a named action, e.g. `track('kofi-click', { place: 'footer' })`. */
  track(event: string, data?: Record<string, string | number>): void {
    this.doc.defaultView?.umami?.track(event, data);
  }
}
