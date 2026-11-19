import { GuideTabs } from './guide.schema';
import { Component, effect, inject } from '@angular/core';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import { AppTabsComponent } from '../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../shared/app-tabs/tabbed-page';
import { defaultTab } from '../../shared/app-tabs/tab-path';
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
    super(GuideTabs, PAGE_SEO.guide.path);
    const seo = inject(SeoService);
    effect(() => {
      const tab = this.activeTab();
      const isDefault = tab === defaultTab(GuideTabs);
      const path = this.tabHref(tab);
      seo.update({
        ...PAGE_SEO.guide,
        title: isDefault
          ? PAGE_SEO.guide.title
          : `${tab.label} – ${PAGE_SEO.guide.title}`,
        path,
        breadcrumbs: [
          { name: 'Guide', path: PAGE_SEO.guide.path },
          ...(isDefault ? [] : [{ name: tab.label, path }]),
        ],
      });
    });
  }
}
