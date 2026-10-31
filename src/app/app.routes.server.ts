import { RenderMode, ServerRoute } from '@angular/ssr';
import { Event } from './core/enums/events';
import { KNIGHT_SECTIONS } from './features/knight-development/knight-development.data';

// Public pages are prerendered to real HTML files at build time, so GitHub Pages serves
// them with HTTP 200 and crawlers (and link previews) get the content without running JS.
// Everything else (login, alliance tools) stays client-rendered.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
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
  { path: 'guide', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
