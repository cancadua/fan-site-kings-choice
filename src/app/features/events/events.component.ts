import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { Event } from '../../core/enums/events';
import {
  EVENT_SEO,
  EVENT_TAB_DESCRIPTIONS,
  PAGE_SEO,
  SITE_URL,
} from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import {
  TAB_PARAM,
  defaultTab,
  findTab,
  tabPath,
} from '../../shared/app-tabs/tab-path';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';
import { EVENT_TABS, eventPath } from './event-tabs';
import { EVENTS_NAV } from './events.data';
import { saveLastEvent } from './last-event';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { ReapWhatYouSowComponent } from './reap-what-you-sow/reap-what-you-sow.component';
import { StruggleForSupremacyComponent } from './struggle-for-supremacy/struggle-for-supremacy.component';
import { SchoolOfAthensComponent } from './school-of-athens/school-of-athens.component';
import { SiegeOfTheUndeadComponent } from './siege-of-the-undead/siege-of-the-undead.component';
import { RealmRevivalComponent } from './realm-revival/realm-revival.component';
import { SpiceRoadComponent } from './spice-road/spice-road.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NavHubComponent,
    UnchartedWatersComponent,
    ReapWhatYouSowComponent,
    StruggleForSupremacyComponent,
    SchoolOfAthensComponent,
    SiegeOfTheUndeadComponent,
    RealmRevivalComponent,
    SpiceRoadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly seo = inject(SeoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** The event and tab come from the URL (`/events/:event/:tab`), so each has its own page. */
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly activeEvent = computed<Event>(() => {
    const requested = this.params().get('event');
    return this.isEvent(requested) ? requested : Event.UnchartedWaters;
  });

  /** Open tab, for the page title and canonical URL (the event component shows it). */
  private readonly activeTab = computed(() => {
    const tabs = EVENT_TABS[this.activeEvent()];
    return findTab(tabs, this.params().get(TAB_PARAM)) ?? defaultTab(tabs);
  });

  readonly Event = Event;

  readonly events = EVENTS_NAV;

  protected readonly eventHref = eventPath;

  constructor() {
    effect(() => {
      const event = this.activeEvent();
      const tab = this.activeTab();
      const tabs = EVENT_TABS[event];
      const isDefaultTab = tab === defaultTab(tabs);
      const details = EVENT_SEO[event];
      const item = this.events.find((e) => e.id === event);
      const title = item?.title ?? details.title;
      const preview = item?.banner?.og ?? item?.banner;
      const page = eventPath(event);
      const path = tabPath(page, tabs, tab.value);
      const describeTab = EVENT_TAB_DESCRIPTIONS[tab.value];
      this.seo.update({
        title: isDefaultTab ? details.title : `${tab.label} – ${details.title}`,
        description:
          isDefaultTab || !describeTab
            ? details.description
            : describeTab(title),
        path,
        breadcrumbs: [
          { name: 'Events', path: PAGE_SEO.events.path },
          { name: title, path: page },
          ...(isDefaultTab ? [] : [{ name: tab.label, path }]),
        ],
        image: preview && {
          url: `${SITE_URL}/${preview.src}`,
          width: preview.width,
          height: preview.height,
        },
      });
      // The events list offers to continue with this event.
      if (this.isBrowser) saveLastEvent(event);
    });
  }

  onEventChange(event: Event): void {
    this.analytics.track('event-select', { event });
    this.router.navigate([eventPath(event)], {
      queryParams: { [TAB_PARAM]: null, map: null, event: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private isEvent(value: string | null): value is Event {
    return !!value && this.events.some((e) => e.id === value);
  }
}
