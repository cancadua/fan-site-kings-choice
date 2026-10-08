import { Routes } from '@angular/router';

import { AllianceShellComponent } from './alliance-shell.component';

export const allianceRoutes: Routes = [
  {
    path: '',
    component: AllianceShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/alliance-dashboard.component').then(m => m.AllianceDashboardComponent),
      },
      {
        path: 'players',
        loadComponent: () => import('./players/alliance-players.component').then(m => m.AlliancePlayersComponent),
      },
      {
        path: 'events',
        loadComponent: () => import('./events/alliance-events.component').then(m => m.AllianceEventsComponent),
      },
      {
        path: 'rewards',
        loadComponent: () => import('./rewards/alliance-rewards.component').then(m => m.AllianceRewardsComponent),
      },
      {
        path: 'mvp',
        loadComponent: () => import('./mvp/alliance-mvp.component').then(m => m.AllianceMvpComponent),
      },
      {
        path: 'members',
        loadComponent: () => import('./members/alliance-members.component').then(m => m.AllianceMembersComponent),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
