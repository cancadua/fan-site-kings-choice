import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { ContentTab } from './app-tabs.schema';

let nextTabsId = 0;

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.scss'],
})
export class AppTabsComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly tabsContainer =
    viewChild<ElementRef<HTMLElement>>('tabsContainer');
  private readonly tabsWrapper =
    viewChild<ElementRef<HTMLElement>>('tabsWrapper');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  /** Unique per instance so tab ↔ panel ARIA links never collide. */
  private readonly idPrefix = `tabs-${nextTabsId++}`;
  protected readonly panelId = `${this.idPrefix}-panel`;

  tabs = input<ContentTab[]>();

  /** URL of each tab. Tabs are real links, so crawlers and "open in new tab" work. */
  tabHref = input.required<(tab: ContentTab) => string>();

  activeTab = model<ContentTab | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const panel = this.panel()?.nativeElement;
      if (!panel) return;
      const stop = this.listenForSwipes(panel);
      destroyRef.onDestroy(stop);
    });
  }

  get visibleTabs(): ContentTab[] {
    return this.tabs()?.filter((tab) => !tab.hidden) ?? [];
  }

  get activeIndex(): number {
    const activeTab = this.activeTab();
    if (!activeTab) return -1;
    return this.visibleTabs.findIndex((tab) => tab.value === activeTab.value);
  }

  get prevTab(): ContentTab | null {
    return this.activeIndex > 0 ? this.visibleTabs[this.activeIndex - 1] : null;
  }

  get nextTab(): ContentTab | null {
    const index = this.activeIndex;
    return index !== -1 && index < this.visibleTabs.length - 1
      ? this.visibleTabs[index + 1]
      : null;
  }

  protected get activeTabId(): string | null {
    const activeTab = this.activeTab();
    return activeTab ? this.tabId(activeTab) : null;
  }

  protected tabId(tab: ContentTab): string {
    return `${this.idPrefix}-${tab.value}`;
  }

  selectTab(tab: ContentTab) {
    this.activeTab.set(tab);
    setTimeout(() => this.scrollToActiveTab(), 0);
  }

  /**
   * A plain click switches the tab in place. Ctrl/Cmd/Shift/Alt-click keeps the
   * browser's own behaviour (new tab or window).
   */
  protected onTabClick(
    event: MouseEvent,
    tab: ContentTab,
    fromPager = false
  ): void {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    if (fromPager) this.goToTab(tab);
    else this.selectTab(tab);
  }

  /** Used by the pager under the content: switches tab and brings the tab bar back into view. */
  protected goToTab(tab: ContentTab): void {
    this.selectTab(tab);
    if (!this.isBrowser) return;
    const wrapper = this.tabsWrapper()?.nativeElement;
    if (!wrapper || wrapper.getBoundingClientRect().top >= 0) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    wrapper.scrollIntoView({
      block: 'start',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  /** WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs. */
  protected onTabKeydown(event: KeyboardEvent): void {
    const tabs = this.visibleTabs;
    const current = this.activeIndex;
    if (!tabs.length || current === -1) return;

    let target: number;
    switch (event.key) {
      case 'ArrowRight':
        target = (current + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        target = (current - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.selectTab(tabs[target]);
    setTimeout(() => {
      this.tabsContainer()
        ?.nativeElement.querySelector<HTMLElement>('[role="tab"].active')
        ?.focus();
    }, 0);
  }

  /**
   * Phones: a clear horizontal swipe on the content opens the next or previous
   * tab. Swipes that start in form fields, in sideways-scrolling areas or in
   * anything marked `data-no-swipe` (e.g. the cities planner) are left alone.
   */
  private listenForSwipes(panel: HTMLElement): () => void {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (event: TouchEvent) => {
      tracking =
        event.touches.length === 1 && !this.blocksSwipe(event.target, panel);
      if (!tracking) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };
    const onEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
      const target = dx < 0 ? this.nextTab : this.prevTab;
      if (target) this.goToTab(target);
    };

    panel.addEventListener('touchstart', onStart, { passive: true });
    panel.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      panel.removeEventListener('touchstart', onStart);
      panel.removeEventListener('touchend', onEnd);
    };
  }

  private blocksSwipe(target: EventTarget | null, panel: HTMLElement): boolean {
    let el = target instanceof Element ? target : null;
    while (el && el !== panel) {
      if (
        el.matches('input, select, textarea, [data-no-swipe], [popover]') ||
        el.scrollWidth > el.clientWidth + 1
      ) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  private scrollToActiveTab(): void {
    if (!this.isBrowser) return;
    const container = this.tabsContainer()?.nativeElement;
    if (!container) return;

    const activeButton = container.querySelector(
      '[role="tab"].active'
    ) as HTMLElement;
    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const scrollAmount =
      buttonRect.left -
      containerRect.left -
      containerRect.width / 2 +
      buttonRect.width / 2;

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
