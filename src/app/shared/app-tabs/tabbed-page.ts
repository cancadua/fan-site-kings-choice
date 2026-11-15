import { WritableSignal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { ContentTab } from './app-tabs.schema';

/**
 * Base for pages with tabs. The open tab lives in `?tab=` so it can be shared;
 * the page also follows later changes to it (search results and shared links
 * that only switch the tab reuse the page instead of recreating it).
 */
export abstract class TabbedPage {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  readonly activeTab: WritableSignal<ContentTab>;

  protected constructor(protected readonly tabs: ContentTab[]) {
    this.activeTab = signal(
      this.tabFor(this.route.snapshot.queryParamMap.get('tab'))
    );

    this.route.queryParamMap
      .pipe(
        map((params) => params.get('tab')),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => {
        const tab = this.tabFor(value);
        if (tab.value !== this.activeTab().value) this.activeTab.set(tab);
      });
  }

  onTabChange(tab: ContentTab | null): void {
    if (!tab) return;
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab.value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private tabFor(value: string | null): ContentTab {
    const fallback = this.tabs.find((tab) => !tab.hidden) ?? this.tabs[0];
    return (
      this.tabs.find((tab) => tab.value === value && !tab.hidden) ?? fallback
    );
  }
}
