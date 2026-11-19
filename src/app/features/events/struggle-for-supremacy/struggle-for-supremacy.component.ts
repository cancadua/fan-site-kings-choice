import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { Event } from '../../../core/enums/events';
import { eventPath } from '../event-tabs';
import { StruggleForSupremacyTabs } from './struggle-for-supremacy.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-struggle-for-supremacy',
  standalone: true,
  imports: [AppTabsComponent, ...EVENT_CONTENT],
  templateUrl: './struggle-for-supremacy.component.html',
  styleUrl: './struggle-for-supremacy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StruggleForSupremacyComponent extends TabbedPage {
  constructor() {
    super(StruggleForSupremacyTabs, eventPath(Event.StruggleForSupremacy));
  }
}
