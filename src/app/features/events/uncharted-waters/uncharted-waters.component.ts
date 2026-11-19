import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { MovesCalculatorComponent } from '../../../shared/moves-calculator/moves-calculator.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { Event } from '../../../core/enums/events';
import { eventPath } from '../event-tabs';
import { EVENT_CONTENT } from '../../../shared/event-content';
import { UwGoodsTableComponent } from './uw-goods-table/uw-goods-table.component';
import { UwCitiesToolComponent } from './uw-cities-tool/uw-cities-tool.component';
import {
  UnchartedWaterTabs,
  UnchartedWatersMoves,
} from './uncharted-waters.schema';

@Component({
  selector: 'app-uncharted-waters',
  standalone: true,
  imports: [
    AppTabsComponent,
    MovesCalculatorComponent,
    UwCitiesToolComponent,
    UwGoodsTableComponent,
    ...EVENT_CONTENT,
  ],
  templateUrl: './uncharted-waters.component.html',
  styleUrl: './uncharted-waters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnchartedWatersComponent extends TabbedPage {
  protected readonly moves = UnchartedWatersMoves;

  constructor() {
    super(UnchartedWaterTabs, eventPath(Event.UnchartedWaters));
  }
}
