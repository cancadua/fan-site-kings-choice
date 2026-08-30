import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentTab } from './app-tabs.schema';

export abstract class TabbedPage {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  activeTab: ContentTab;

  protected constructor(protected readonly tabs: ContentTab[]) {
    const fallback = tabs.find(tab => !tab.hidden) ?? tabs[0];
    const requested = this.route.snapshot.queryParamMap.get('tab');
    this.activeTab = tabs.find(tab => tab.value === requested && !tab.hidden) ?? fallback;
  }

  onTabChange(tab: ContentTab | null): void {
    if (!tab) return;
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab.value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
