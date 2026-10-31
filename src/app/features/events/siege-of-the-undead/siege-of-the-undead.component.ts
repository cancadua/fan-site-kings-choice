import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { SiegeOfTheUndeadTabs } from './siege-of-the-undead.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-siege-of-the-undead',
  standalone: true,
  imports: [AppTabsComponent, ...EVENT_CONTENT],
  templateUrl: './siege-of-the-undead.component.html',
  styleUrl: './siege-of-the-undead.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiegeOfTheUndeadComponent extends TabbedPage {
  constructor() {
    super(SiegeOfTheUndeadTabs);
  }
}
