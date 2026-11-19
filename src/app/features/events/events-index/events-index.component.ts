import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Event } from '../../../core/enums/events';
import { EVENT_SEO, PAGE_SEO } from '../../../core/seo/seo.constants';
import { SeoService } from '../../../core/seo/seo.service';
import { tabPath } from '../../../shared/app-tabs/tab-path';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { NavHubItem } from '../../../shared/nav-hub/nav-hub.schema';
import { EVENT_TABS, eventPath } from '../event-tabs';
import { EVENTS_NAV } from '../events.data';
import { loadLastEvent } from '../last-event';

interface EventEntry {
  event: NavHubItem<Event>;
  path: string;
  description: string;
  /** Every visible tab of the guide, each with its own URL. */
  sections: { label: string; path: string }[];
}

/**
 * `/events`: every event guide with links to each of its sections. Visitors use it to
 * pick an event; crawlers use it to find every guide page.
 */
@Component({
  selector: 'app-events-index',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './events-index.component.html',
  styleUrl: './events-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsIndexComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly entries: EventEntry[] = EVENTS_NAV.map((event) => {
    const page = eventPath(event.id);
    const tabs = EVENT_TABS[event.id];
    return {
      event,
      path: page,
      description: EVENT_SEO[event.id].description,
      sections: tabs
        .filter((tab) => !tab.hidden)
        .map((tab) => ({
          label: tab.label,
          path: tabPath(page, tabs, tab.value),
        })),
    };
  });

  /** The event viewed last time, offered as a shortcut (browser only). */
  protected readonly lastEntry = signal<EventEntry | null>(null);

  constructor() {
    inject(SeoService).update({
      ...PAGE_SEO.events,
      breadcrumbs: [{ name: 'Events', path: PAGE_SEO.events.path }],
    });

    afterNextRender(() => {
      // Old `/events?event=<id>` links open that event's guide.
      const legacy = this.route.snapshot.queryParamMap.get('event');
      const legacyEntry = this.entries.find((e) => e.event.id === legacy);
      if (legacyEntry) {
        this.router.navigate([legacyEntry.path], {
          queryParams: { event: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
        return;
      }
      const last = loadLastEvent();
      this.lastEntry.set(this.entries.find((e) => e.event.id === last) ?? null);
    });
  }
}
