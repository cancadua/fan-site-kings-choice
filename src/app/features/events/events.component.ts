import { Component } from '@angular/core';
import { AppDropComponent } from '../../shared/app-drop/app-drop.component';
import { EventsData } from '../../core/constants/events-data';
import { Event } from '../../core/enums/events';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports: [AppDropComponent, UnchartedWatersComponent],
})
export class EventsComponent {
  protected readonly eventsData: Array<Record<string, string>> = EventsData;

  protected readonly Event = Event;

  selectedEvent: Event | null = null;
}
