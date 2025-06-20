import { Component, input, model } from '@angular/core';
import { ContentTab } from './app-tabs.schema';

@Component({
  selector: 'app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.scss'],
  // Removed invalid 'imports' property
})
export class AppTabsComponent {
  tabs = input<ContentTab[]>();

  activeTab = model<ContentTab | null>(null);

  selectTab(tab: ContentTab) {
    this.activeTab.set(tab);
  }
}
