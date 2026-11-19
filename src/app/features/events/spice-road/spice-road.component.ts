import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { Event } from '../../../core/enums/events';
import { eventPath } from '../event-tabs';
import { SpiceRoadTabs } from './spice-road.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-spice-road',
  standalone: true,
  imports: [AppTabsComponent, ...EVENT_CONTENT],
  templateUrl: './spice-road.component.html',
  styleUrl: './spice-road.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpiceRoadComponent extends TabbedPage {
  constructor() {
    super(SpiceRoadTabs, eventPath(Event.SpiceRoad));
  }
}
