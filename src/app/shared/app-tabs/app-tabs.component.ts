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

  get activeIndex(): number {
    const tabs = this.tabs();
    const activeTab = this.activeTab();
    if (!tabs || !activeTab) return -1;
    return tabs.findIndex(tab => tab.value === activeTab.value);
  }

  get hasPrevTab(): boolean {
    return this.activeIndex > 0;
  }

  get hasNextTab(): boolean {
    const tabs = this.tabs();
    return this.activeIndex !== -1 && this.activeIndex < (tabs?.length ?? 0) - 1;
  }

  selectTab(tab: ContentTab) {
    this.activeTab.set(tab);
    setTimeout(() => this.scrollToActiveTab(), 0);
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
