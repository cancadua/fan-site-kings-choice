import { WritableSignal, afterNextRender, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { ScrollPositionKeeper } from '../../core/navigation/scroll-to-top';
import { ContentTab } from './app-tabs.schema';
import { TAB_PARAM, defaultTab, findTab, tabPath } from './tab-path';

/**
 * Base for pages with tabs. Every tab has a URL of its own: the default tab is the
 * page itself (`/events/realm-revival`), the others add a segment
 * (`/events/realm-revival/smart-play`). Each is prerendered as a separate HTML file,
 * so search engines and AI crawlers that do not run JavaScript can read every tab.
 */
export abstract class TabbedPage {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  private readonly scroll = inject(ScrollPositionKeeper);

  readonly activeTab: WritableSignal<ContentTab>;

  /** Link of each tab, so the tab bar is made of real links crawlers can follow. */
  readonly tabHref = (tab: ContentTab): string =>
    tabPath(this.page, this.tabs, tab.value);

  /**
   * @param tabs The page's tabs; the first visible one is the default.
   * @param page URL of the page (its default tab), e.g. `/events/realm-revival`.
   */
  protected constructor(
    protected readonly tabs: ContentTab[],
    private readonly page: string
  ) {
    this.activeTab = signal(
      this.tabFor(this.route.snapshot.paramMap.get(TAB_PARAM))
    );

    this.route.paramMap
      .pipe(
        map((params) => params.get(TAB_PARAM)),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => {
        const tab = this.tabFor(value);
        if (tab.value !== this.activeTab().value) this.activeTab.set(tab);
      });

    // Browser only: old `?tab=` links, and URLs naming the default or an unknown
    // tab, move to the tab's own URL once the prerendered page is on screen.
    afterNextRender(() => {
      const legacy = findTab(
        this.tabs,
        this.route.snapshot.queryParamMap.get(TAB_PARAM)
      );
      const target = legacy ?? this.activeTab();
      const current = this.router.url.split(/[?#]/)[0].replace(/\/$/, '');
      if (legacy || current !== this.tabHref(target)) {
        this.activeTab.set(target);
        this.goTo(target);
      }
    });
  }

  onTabChange(tab: ContentTab | null): void {
    if (!tab) return;
    this.activeTab.set(tab);
    this.goTo(tab);
  }

  private goTo(tab: ContentTab): void {
    const url = this.tabHref(tab);
    this.scroll.keepFor(url);
    this.router.navigate([url], {
      queryParams: { [TAB_PARAM]: null },
      queryParamsHandling: 'merge',
      preserveFragment: true,
      replaceUrl: true,
    });
  }

  private tabFor(value: string | null): ContentTab {
    return findTab(this.tabs, value) ?? defaultTab(this.tabs);
  }
}
