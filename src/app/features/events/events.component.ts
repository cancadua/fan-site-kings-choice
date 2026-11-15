import {
  Component,
  ChangeDetectionStrategy,
  afterNextRender,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { Event } from '../../core/enums/events';
import { EVENT_SEO, SITE_URL } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';
import { EVENTS_NAV } from './events.data';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { ReapWhatYouSowComponent } from './reap-what-you-sow/reap-what-you-sow.component';
import { StruggleForSupremacyComponent } from './struggle-for-supremacy/struggle-for-supremacy.component';
import { SchoolOfAthensComponent } from './school-of-athens/school-of-athens.component';
import { SiegeOfTheUndeadComponent } from './siege-of-the-undead/siege-of-the-undead.component';
import { RealmRevivalComponent } from './realm-revival/realm-revival.component';

const LAST_EVENT_KEY = 'kc.lastEvent';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly seo = inject(SeoService);

  /** The event comes from the URL (`/events/:event`), so each event has its own page. */
  private readonly requestedEvent = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('event'))),
    { initialValue: this.route.snapshot.paramMap.get('event') }
  );

  readonly activeEvent = computed<Event>(() => {
    const requested = this.requestedEvent();
    return this.isEvent(requested) ? requested : Event.UnchartedWaters;
  });
  readonly Event = Event;

  readonly events = EVENTS_NAV;

  constructor() {
    effect(() => {
      const event = this.activeEvent();
      const details = EVENT_SEO[event];
      const item = this.events.find((e) => e.id === event);
      const title = item?.title ?? details.title;
      const preview = item?.banner?.og ?? item?.banner;
      this.seo.update({
        title: details.title,
        description: details.description,
        path: `/events/${event}`,
        breadcrumbs: [
          { name: 'Events', path: `/events/${Event.UnchartedWaters}` },
          { name: title, path: `/events/${event}` },
        ],
        image: preview && {
          url: `${SITE_URL}/${preview.src}`,
          width: preview.width,
          height: preview.height,
        },
      });
    });

    // Browser only: old `?event=` links and the remembered event move to the
    // matching `/events/:event` URL once the prerendered page is on screen.
    afterNextRender(() => {
      const legacy = this.route.snapshot.queryParamMap.get('event');
      const target = this.isEvent(legacy)
        ? legacy
        : this.requestedEvent() === null
          ? this.loadLastEvent()
          : null;
      if (this.isEvent(target) && target !== this.activeEvent()) {
        this.goTo(target, { event: null });
      } else if (legacy) {
        this.goTo(this.activeEvent(), { event: null });
      }
    });
  }

  onEventChange(event: Event): void {
    this.saveLastEvent(event);
    this.analytics.track('event-select', { event });
    this.goTo(event, { tab: null, map: null, event: null });
  }

  private goTo(event: Event, queryParams: Record<string, null>): void {
    this.router.navigate(['/events', event], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private isEvent(value: string | null): value is Event {
    return !!value && this.events.some((e) => e.id === value);
  }

  // Remembers the last viewed event; storage can be blocked, so failures are ignored.
  private loadLastEvent(): string | null {
    try {
      return localStorage.getItem(LAST_EVENT_KEY);
    } catch {
      return null;
    }
  }

  private saveLastEvent(event: Event): void {
    try {
      localStorage.setItem(LAST_EVENT_KEY, event);
    } catch {
      // ignore
    }
  }
}
