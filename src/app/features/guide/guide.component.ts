import { GuideTabs } from './guide.schema';
import { Component, inject } from '@angular/core';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
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
    inject(SeoService).update({
      ...PAGE_SEO.guide,
      breadcrumbs: [{ name: 'Guide', path: PAGE_SEO.guide.path }],
    });
  }
}
