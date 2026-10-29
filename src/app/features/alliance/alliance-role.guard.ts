import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AllianceRole } from '../../core/api/api.models';
import { AllianceStateService } from './alliance-state.service';

/**
 * Allows a route only to the roles listed in its `data.roles` (for the selected
 * alliance); everyone else goes back to the alliance home.
 */
export const allianceRoleGuard: CanActivateFn = async (route) => {
  const state = inject(AllianceStateService);
  const router = inject(Router);
  const roles = route.data['roles'] as readonly AllianceRole[] | undefined;

  await state.ensureLoaded();
  const role = state.selected()?.myRole;
  // Without an alliance the shell shows its empty state, whatever the route.
  if (!roles || !role || roles.includes(role)) return true;
  return router.createUrlTree(['/alliance']);
};
