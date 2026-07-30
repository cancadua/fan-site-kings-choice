import { ContentTab } from './app-tabs.schema';

export abstract class TabbedPage {
  activeTab: ContentTab;

  protected constructor(protected readonly tabs: ContentTab[]) {
    this.activeTab = tabs[0];
  }
}
