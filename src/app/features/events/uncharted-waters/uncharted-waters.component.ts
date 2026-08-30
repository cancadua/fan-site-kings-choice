import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { UwDescriptionComponent } from './uw-description/uw-description.component';
import { UwCitiesToolComponent } from './uw-cities-tool/uw-cities-tool.component';
import { UnchartedWaterTabs } from './uncharted-waters.schema';

@Component({
  selector: 'app-uncharted-waters',
  standalone: true,
  imports: [AppTabsComponent, UwDescriptionComponent, UwCitiesToolComponent],
  templateUrl: './uncharted-waters.component.html',
  styleUrl: './uncharted-waters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnchartedWatersComponent extends TabbedPage {
  constructor() {
    super(UnchartedWaterTabs);
  }
}
