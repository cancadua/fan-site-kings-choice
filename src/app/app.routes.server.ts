import { RenderMode, ServerRoute } from '@angular/ssr';
import { Event } from './core/enums/events';
import { EVENT_TABS } from './features/events/event-tabs';
import { GuideTabs } from './features/guide/guide.schema';
import { KNIGHT_SECTIONS } from './features/knight-development/knight-development.data';
import { subTabs } from './shared/app-tabs/tab-path';

// Public pages are prerendered to real HTML files at build time, so GitHub Pages serves
// them with HTTP 200 and crawlers (and link previews) get the content without running JS.
// Every tab of a tabbed page has its own URL and file (`/events/realm-revival/smart-play`).
// Everything else (login, alliance tools) stays client-rendered.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    // Every tab except the default one, which is the event's own page.
    path: 'events/:event/:tab',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.values(Event).flatMap((event) =>
        subTabs(EVENT_TABS[event]).map((tab) => ({ event, tab: tab.value }))
      ),
  },
  {
    path: 'events/:event',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.values(Event).map((event) => ({ event })),
  },
  { path: 'events', renderMode: RenderMode.Prerender },
  {
    path: 'knight-development/:section',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      KNIGHT_SECTIONS.map((section) => ({ section: section.id })),
  },
  { path: 'knight-development', renderMode: RenderMode.Prerender },
  {
    path: 'guide/:tab',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      subTabs(GuideTabs).map((tab) => ({ tab: tab.value })),
  },
  { path: 'guide', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
