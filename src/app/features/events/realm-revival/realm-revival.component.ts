import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { MovesCalculatorComponent } from '../../../shared/moves-calculator/moves-calculator.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { Event } from '../../../core/enums/events';
import { eventPath } from '../event-tabs';
import { RealmRevivalTabs, RealmRevivalMoves } from './realm-revival.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-realm-revival',
  standalone: true,
  imports: [AppTabsComponent, MovesCalculatorComponent, ...EVENT_CONTENT],
  templateUrl: './realm-revival.component.html',
  styleUrl: './realm-revival.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealmRevivalComponent extends TabbedPage {
  protected readonly moves = RealmRevivalMoves;

  constructor() {
    super(RealmRevivalTabs, eventPath(Event.RealmRevival));
  }
}
