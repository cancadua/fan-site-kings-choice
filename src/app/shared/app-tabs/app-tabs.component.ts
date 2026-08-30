import { Component, ElementRef, input, model, viewChild } from '@angular/core';
import { ContentTab } from './app-tabs.schema';

@Component({
  selector: 'app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.scss'],
})
export class AppTabsComponent {
  private readonly tabsContainer = viewChild<ElementRef<HTMLElement>>('tabsContainer');

  tabs = input<ContentTab[]>();

  activeTab = model<ContentTab | null>(null);

  get visibleTabs(): ContentTab[] {
    return this.tabs()?.filter(tab => !tab.hidden) ?? [];
  }

  get activeIndex(): number {
    const activeTab = this.activeTab();
    if (!activeTab) return -1;
    return this.visibleTabs.findIndex(tab => tab.value === activeTab.value);
  }

  get hasPrevTab(): boolean {
    return this.activeIndex > 0;
  }

  get hasNextTab(): boolean {
    return this.activeIndex !== -1 && this.activeIndex < this.visibleTabs.length - 1;
  }

  selectTab(tab: ContentTab) {
    this.activeTab.set(tab);
    setTimeout(() => this.scrollToActiveTab(), 0);
  }

  selectPrevTab(): void {
    if (!this.hasPrevTab) return;
    this.selectTab(this.visibleTabs[this.activeIndex - 1]);
  }

  selectNextTab(): void {
    if (!this.hasNextTab) return;
    this.selectTab(this.visibleTabs[this.activeIndex + 1]);
  }

  private scrollToActiveTab(): void {
    const container = this.tabsContainer()?.nativeElement;
    if (!container) return;

    const activeButton = container.querySelector('button.active') as HTMLElement;
    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const scrollAmount = buttonRect.left - containerRect.left - containerRect.width / 2 + buttonRect.width / 2;

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
