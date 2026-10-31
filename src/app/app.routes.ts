import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { Event } from './core/enums/events';
import { SHARED_MAP_PARAM } from './features/events/uncharted-waters/uw-cities-tool/shared-map.constants';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for the home page
  // Everything except the home page is lazy-loaded to keep the initial bundle small.
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events.component').then(
        (m) => m.EventsComponent
      ),
  },
  {
    path: 'guide',
    loadComponent: () =>
      import('./features/guide/guide.component').then((m) => m.GuideComponent),
  },
  {
    path: 'knight-development',
    loadComponent: () =>
      import('./features/knight-development/knight-development.component').then(
        (m) => m.KnightDevelopmentComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    // Short link to a shared Uncharted Waters map
    path: 'uncharted-waters/:code',
    redirectTo: ({ params }) =>
      inject(Router).createUrlTree(['/events'], {
        queryParams: {
          event: Event.UnchartedWaters,
          tab: 'cities-tool',
          [SHARED_MAP_PARAM]: params['code'],
        },
      }),
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
