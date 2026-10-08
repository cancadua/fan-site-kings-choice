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
      { path: '**', redirectTo: '' },
    ],
  },
];
