import { Routes } from '@angular/router';

import { allianceRoleGuard } from './alliance-role.guard';
import { MANAGER_ROLES } from './alliance-sections';
import { AllianceShellComponent } from './alliance-shell.component';

/** Restricts a route to Owner/Leader of the selected alliance. */
const managersOnly = {
  canActivate: [allianceRoleGuard],
  data: { roles: MANAGER_ROLES },
};

export const allianceRoutes: Routes = [
  {
    path: '',
    component: AllianceShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/alliance-dashboard.component').then(
            (m) => m.AllianceDashboardComponent
          ),
      },
      {
        path: 'players',
        ...managersOnly,
        loadComponent: () =>
          import('./players/alliance-players.component').then(
            (m) => m.AlliancePlayersComponent
          ),
      },
      {
        path: 'events',
        ...managersOnly,
        loadComponent: () =>
          import('./events/alliance-events.component').then(
            (m) => m.AllianceEventsComponent
          ),
      },
      {
        path: 'rewards',
        ...managersOnly,
        loadComponent: () =>
          import('./rewards/alliance-rewards.component').then(
            (m) => m.AllianceRewardsComponent
          ),
      },
      {
        path: 'mvp',
        ...managersOnly,
        loadComponent: () =>
          import('./mvp/alliance-mvp.component').then(
            (m) => m.AllianceMvpComponent
          ),
      },
      {
        path: 'members',
        ...managersOnly,
        loadComponent: () =>
          import('./members/alliance-members.component').then(
            (m) => m.AllianceMembersComponent
          ),
      },
      {
        path: 'link-history',
        ...managersOnly,
        loadComponent: () =>
          import('./link-history/alliance-link-history.component').then(
            (m) => m.AllianceLinkHistoryComponent
          ),
      },
      {
        path: 'link',
        loadComponent: () =>
          import('./link-account/alliance-link-account.component').then(
            (m) => m.AllianceLinkAccountComponent
          ),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
