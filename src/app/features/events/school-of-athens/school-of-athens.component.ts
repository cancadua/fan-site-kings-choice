import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { MovesCalculatorComponent } from '../../../shared/moves-calculator/moves-calculator.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { Event } from '../../../core/enums/events';
import { eventPath } from '../event-tabs';
import {
  SchoolOfAthensTabs,
  SchoolOfAthensMoves,
} from './school-of-athens.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-school-of-athens',
  standalone: true,
  imports: [AppTabsComponent, MovesCalculatorComponent, ...EVENT_CONTENT],
  templateUrl: './school-of-athens.component.html',
  styleUrl: './school-of-athens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolOfAthensComponent extends TabbedPage {
  protected readonly moves = SchoolOfAthensMoves;

  constructor() {
    super(SchoolOfAthensTabs, eventPath(Event.SchoolOfAthens));
  }
}
