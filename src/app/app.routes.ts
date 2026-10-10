import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { GuideComponent } from './features/guide/guide.component';
import { KnightDevelopmentComponent } from './features/knight-development/knight-development.component';
import { authGuard } from './core/auth/auth.guard';
import { Login } from './pages/login/login';
import { Event } from './core/enums/events';
import { SHARED_MAP_PARAM } from './features/events/uncharted-waters/uw-cities-tool/uw-cities-tool.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for the home page
  { path: 'events', component: EventsComponent }, // Add route for /events
  { path: 'guide', component: GuideComponent }, // Add route for /guide
  { path: 'knight-development', component: KnightDevelopmentComponent }, // Add route for knight development
  { path: 'login', component: Login },
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
