import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { Event } from '../../core/enums/events';
import { IntroPlayback } from '../../core/intro/intro-playback.service';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { ReapWhatYouSowComponent } from './reap-what-you-sow/reap-what-you-sow.component';
import { StruggleForSupremacyComponent } from './struggle-for-supremacy/struggle-for-supremacy.component';
import { SchoolOfAthensComponent } from './school-of-athens/school-of-athens.component';
import { SiegeOfTheUndeadComponent } from './siege-of-the-undead/siege-of-the-undead.component';

const LAST_EVENT_KEY = 'kc.lastEvent';

interface EventDetail {
  id: Event;
  title: string;
  subtitle: string;
}

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly intro = inject(IntroPlayback);

  activeEvent: Event = Event.UnchartedWaters;
  readonly Event = Event;

  events: EventDetail[] = [
    {
      id: Event.UnchartedWaters,
      title: 'Uncharted Waters',
      subtitle: 'Trade & Plunder Event',
    },
    {
      id: Event.ReapWhatYouSow,
      title: 'Reap What You Sow',
      subtitle: 'Flora & Fauna Event',
    },
    {
      id: Event.StruggleForSupremacy,
      title: 'Struggle for Supremacy',
      subtitle: 'Alliance Season Event',
    },
    {
      id: Event.SchoolOfAthens,
      title: 'School of Athens',
      subtitle: '3-Player Team Event',
    },
    {
      id: Event.SiegeOfTheUndead,
      title: 'Siege of the Undead',
      subtitle: 'Alliance Defense Event',
    },
  ];

  ngOnInit(): void {
    const requestedEvent =
      this.route.snapshot.queryParamMap.get('event') ?? this.loadLastEvent();
    if (requestedEvent && this.events.some((e) => e.id === requestedEvent)) {
      this.activeEvent = requestedEvent as Event;
    }
  }

  ngOnDestroy(): void {
    this.intro.reset();
  }

  onEventChange(event: Event): void {
    // Intro scenes play only after the viewer switches events here, never on arrival.
    this.intro.enable();
    this.activeEvent = event;
    this.saveLastEvent(event);
    this.analytics.track('event-select', { event });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { event, tab: null, map: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
