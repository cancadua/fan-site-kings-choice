import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../core/enums/events';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { ReapWhatYouSowComponent } from './reap-what-you-sow/reap-what-you-sow.component';

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
  imports: [CommonModule, NavHubComponent, UnchartedWatersComponent, ReapWhatYouSowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute) {}

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
  ];

  ngOnInit(): void {
    const requestedEvent = this.route.snapshot.queryParamMap.get('event');
    if (requestedEvent && this.events.some(e => e.id === requestedEvent)) {
      this.activeEvent = requestedEvent as Event;
    }
  }
}
