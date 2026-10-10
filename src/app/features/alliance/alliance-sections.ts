import { AllianceRole } from '../../core/api/api.models';

/** Roles that manage the alliance (players, events, rewards, accounts). */
export const MANAGER_ROLES: readonly AllianceRole[] = ['Owner', 'Leader'];
export const ALL_ROLES: readonly AllianceRole[] = ['Owner', 'Leader', 'Member'];

export function isManagerRole(role: AllianceRole | undefined): boolean {
  return role !== undefined && MANAGER_ROLES.includes(role);
}

export interface AllianceSection {
  label: string;
  /** Path under /alliance ('' is the alliance home). */
  path: string;
  /** Roles in the selected alliance that may open the section. */
  roles: readonly AllianceRole[];
  /** Shows the number of pending link requests next to the label. */
  showsPendingRequests?: boolean;
}

/**
 * Navigation of the alliance area. To open a section to plain Members, add
 * 'Member' to its roles here and to the route's `data.roles` in alliance.routes.ts.
 */
export const ALLIANCE_SECTIONS: readonly AllianceSection[] = [
  { label: 'Dashboard', path: '', roles: ALL_ROLES },
  {
    label: 'Players',
    path: 'players',
    roles: MANAGER_ROLES,
    showsPendingRequests: true,
  },
  { label: 'Events', path: 'events', roles: MANAGER_ROLES },
  { label: 'Rewards', path: 'rewards', roles: MANAGER_ROLES },
  { label: 'MVP', path: 'mvp', roles: MANAGER_ROLES },
  { label: 'Members', path: 'members', roles: MANAGER_ROLES },
  { label: 'Link history', path: 'link-history', roles: MANAGER_ROLES },
  { label: 'Link account', path: 'link', roles: ALL_ROLES },
];
