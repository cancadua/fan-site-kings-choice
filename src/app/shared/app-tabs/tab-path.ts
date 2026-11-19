import { ContentTab } from './app-tabs.schema';

/** Route parameter holding the open tab: `<page>/:tab`. */
export const TAB_PARAM = 'tab';

/** The tab a page opens on. It lives at the page's own URL. */
export function defaultTab(tabs: readonly ContentTab[]): ContentTab {
  return tabs.find((tab) => !tab.hidden) ?? tabs[0];
}

/** The visible tab with this value, if there is one. */
export function findTab(
  tabs: readonly ContentTab[],
  value: string | null
): ContentTab | undefined {
  return tabs.find((tab) => tab.value === value && !tab.hidden);
}

/** Tabs with a URL of their own (`<page>/<tab>`): every visible tab except the default one. */
export function subTabs(tabs: readonly ContentTab[]): ContentTab[] {
  const first = defaultTab(tabs);
  return tabs.filter((tab) => !tab.hidden && tab !== first);
}

/**
 * URL of a tab. The default tab is the page itself, the others are `<page>/<tab>`,
 * so every tab is prerendered as its own HTML file that crawlers can read without JS.
 */
export function tabPath(
  page: string,
  tabs: readonly ContentTab[],
  value: string
): string {
  return value === defaultTab(tabs).value ? page : `${page}/${value}`;
}
