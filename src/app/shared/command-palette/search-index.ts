import { GLOSSARY } from '../../core/constants/glossary';
import { EVENT_TABS, eventPath } from '../../features/events/event-tabs';
import { EVENTS_NAV } from '../../features/events/events.data';
import { GuideTabs } from '../../features/guide/guide.schema';
import { KNIGHT_SECTIONS } from '../../features/knight-development/knight-development.data';
import { IconName } from '../app-icon/icons';
import { subTabs, tabPath } from '../app-tabs/tab-path';
import { slugify } from '../utils/slug';

export type SearchGroup =
  'Events' | 'Tools' | 'Event guides' | 'Knights' | 'Glossary' | 'Pages';

export interface SearchEntry {
  title: string;
  subtitle?: string;
  group: SearchGroup;
  icon: IconName;
  /** Router URL, may include `#section`. */
  url: string;
  /** Extra words that should find this entry. */
  keywords?: string;
  /** Shown before anything is typed. */
  featured?: boolean;
}

/** Tabs that are tools rather than reading, so they get their own group. */
const TOOL_TABS = new Set(['cities-tool', 'moves-calculator']);

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const event of EVENTS_NAV) {
    const base = eventPath(event.id);
    const tabs = EVENT_TABS[event.id];
    entries.push({
      title: event.title,
      subtitle: event.subtitle,
      group: 'Events',
      icon: event.icon ?? 'scroll',
      url: base,
      keywords: event.facts?.map((f) => `${f.label} ${f.value}`).join(' '),
      featured: true,
    });
    for (const tab of subTabs(tabs)) {
      const isTool = TOOL_TABS.has(tab.value);
      entries.push({
        title: `${event.title} · ${tab.label}`,
        subtitle: isTool ? 'Interactive tool' : 'Step-by-step strategy',
        group: isTool ? 'Tools' : 'Event guides',
        icon: isTool
          ? tab.value === 'moves-calculator'
            ? 'calculator'
            : 'map'
          : 'list',
        url: tabPath(base, tabs, tab.value),
        keywords: isTool
          ? 'tool calculator planner stamina moves refill map cities'
          : 'tips strategy smart play checklist',
        featured: isTool,
      });
    }
  }

  for (const section of KNIGHT_SECTIONS) {
    const base = `/knight-development/${section.id}`;
    entries.push({
      title: section.title,
      subtitle: section.subtitle ?? 'Knight Development',
      group: 'Knights',
      icon: 'swords',
      url: base,
      keywords: 'knight development',
    });
    for (const sub of section.subsections ?? []) {
      entries.push({
        title: sub.title,
        subtitle: section.title,
        group: 'Knights',
        icon: 'swords',
        url: `${base}#${slugify(sub.title)}`,
      });
    }
  }

  for (const entry of Object.values(GLOSSARY)) {
    entries.push({
      title: entry.term,
      subtitle: entry.definition,
      group: 'Glossary',
      icon: 'book',
      url: `/events/${entry.event}`,
    });
  }

  for (const tab of GuideTabs) {
    entries.push({
      title: tab.label,
      subtitle: 'Guide',
      group: 'Pages',
      icon: 'scroll',
      url: tabPath('/guide', GuideTabs, tab.value),
      keywords: 'guide progression lord level resources',
    });
  }

  entries.push(
    { title: 'Home', group: 'Pages', icon: 'home', url: '/' },
    {
      title: 'Alliance Hub',
      subtitle: 'Planning notebook for alliance leaders',
      group: 'Pages',
      icon: 'shield',
      url: '/alliance',
      keywords: 'alliance members invites leaders',
    },
    { title: 'Privacy', group: 'Pages', icon: 'scroll', url: '/privacy' }
  );

  return entries;
}

export const SEARCH_INDEX: readonly SearchEntry[] = buildIndex();

const normalize = (text: string): string =>
  text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Higher is better; 0 means no match. Title hits beat subtitle/keyword hits. */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const title = normalize(entry.title);
  const haystack = `${title} ${normalize(entry.subtitle ?? '')} ${normalize(
    entry.keywords ?? ''
  )}`;

  if (title === query) return 100;
  if (title.startsWith(query)) return 90;
  if (title.split(/[\s·:-]+/).some((word) => word.startsWith(query))) return 75;
  if (title.includes(query)) return 60;
  if (haystack.includes(query)) return 40;

  const words = query.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((word) => haystack.includes(word))) {
    return 35;
  }

  // Loose match: the typed letters appear in order in the title ("sfs", "rwys").
  let next = 0;
  for (const char of title) {
    if (char === query[next]) next++;
    if (next === query.length) return 15;
  }
  return 0;
}

export function search(query: string, limit = 24): SearchEntry[] {
  const q = normalize(query.trim());
  if (!q) return SEARCH_INDEX.filter((entry) => entry.featured);
  return SEARCH_INDEX.map((entry) => ({ entry, score: scoreEntry(entry, q) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((hit) => hit.entry);
}
