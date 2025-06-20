import { UnchartedWaterTabs } from './uncharted-waters.schema';
import { Component } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { ContentTab } from '../../../shared/app-tabs/app-tabs.schema';
import { UwDescriptionComponent } from './uw-description/uw-description.component';
import { UwCitiesToolComponent } from './uw-cities-tool/uw-cities-tool.component';

@Component({
  selector: 'app-uncharted-waters',
  imports: [AppTabsComponent, UwDescriptionComponent, UwCitiesToolComponent],
  templateUrl: './uncharted-waters.component.html',
  styleUrl: './uncharted-waters.component.scss',
})
export class UnchartedWatersComponent {
  protected readonly unchartedWaterTabs = UnchartedWaterTabs;

  activeTab: ContentTab = UnchartedWaterTabs[0];
}
