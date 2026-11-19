import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { Event } from './core/enums/events';
import { SHARED_MAP_PARAM } from './features/events/uncharted-waters/uw-cities-tool/shared-map.constants';
import { SAME_PAGE } from './core/navigation/same-page-reuse.strategy';
import { TAB_PARAM } from './shared/app-tabs/tab-path';

const loadEvents = () =>
  import('./features/events/events.component').then((m) => m.EventsComponent);
const loadGuide = () =>
  import('./features/guide/guide.component').then((m) => m.GuideComponent);
const loadKnights = () =>
  import('./features/knight-development/knight-development.component').then(
    (m) => m.KnightDevelopmentComponent
  );

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for the home page
  // Everything except the home page is lazy-loaded to keep the initial bundle small.
  {
    // Every event guide, with links to each of its sections.
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-index/events-index.component').then(
        (m) => m.EventsIndexComponent
      ),
  },
  {
    // One URL per event and per tab (`/events/:event/:tab`), so each can be indexed and
    // shared on its own. The default tab is the event's own URL.
    path: 'events/:event',
    loadComponent: loadEvents,
    data: { [SAME_PAGE]: 'events' },
  },
  {
    path: `events/:event/:${TAB_PARAM}`,
    loadComponent: loadEvents,
    data: { [SAME_PAGE]: 'events' },
  },
  {
    path: 'guide',
    loadComponent: loadGuide,
    data: { [SAME_PAGE]: 'guide' },
  },
  {
    path: `guide/:${TAB_PARAM}`,
    loadComponent: loadGuide,
    data: { [SAME_PAGE]: 'guide' },
  },
  {
    path: 'knight-development',
    loadComponent: loadKnights,
    data: { [SAME_PAGE]: 'knights' },
  },
  {
    path: 'knight-development/:section',
    loadComponent: loadKnights,
    data: { [SAME_PAGE]: 'knights' },
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    // Short link to a shared Uncharted Waters map
    path: 'uncharted-waters/:code',
    redirectTo: ({ params }) =>
      inject(Router).createUrlTree(
        ['/events', Event.UnchartedWaters, 'cities-tool'],
        { queryParams: { [SHARED_MAP_PARAM]: params['code'] } }
      ),
  },
  {
    path: 'alliance',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/alliance/alliance.routes').then(
        (m) => m.allianceRoutes
      ),
  },
  { path: '**', redirectTo: '' }, // Unknown paths fall back to home (GitHub Pages serves 404.html for deep links)
];
