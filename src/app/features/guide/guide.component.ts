import { GuideTabs } from './guide.schema';
import { Component } from '@angular/core';
import { AppTabsComponent } from '../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../shared/app-tabs/tabbed-page';
import { GuideAdvancedComponent } from './guide-advanced/guide-advanced.component';
import { GuideTipsComponent } from './guide-tips/guide-tips.component';

@Component({
  selector: 'app-guide',
  imports: [AppTabsComponent, GuideAdvancedComponent, GuideTipsComponent],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
})
export class GuideComponent extends TabbedPage {
  constructor() {
    super(GuideTabs);
  }
}
