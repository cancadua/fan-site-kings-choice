import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { AllianceRole, MyAlliance } from '../../core/api/api.models';
import { allianceRoleGuard } from './alliance-role.guard';
import { MANAGER_ROLES } from './alliance-sections';
import { AllianceStateService } from './alliance-state.service';

describe('allianceRoleGuard', () => {
  const selected = signal<MyAlliance | null>(null);

  const alliance = (myRole: AllianceRole): MyAlliance => ({
    id: 'a1',
    name: 'Knights',
    ownerId: 'u1',
    myRole,
    createdAt: '2026-01-01T00:00:00Z',
    memberCount: 3,
    myPlayerId: null,
    myPlayerName: null,
  });

  const run = (roles?: readonly AllianceRole[]) => {
    const route = { data: roles ? { roles } : {} } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      allianceRoleGuard(route, {} as RouterStateSnapshot)
    ) as Promise<boolean | UrlTree>;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AllianceStateService,
          useValue: { selected, ensureLoaded: () => Promise.resolve() },
        },
      ],
    });
  });

  it('lets managers into manager-only routes', async () => {
    selected.set(alliance('Leader'));
    expect(await run(MANAGER_ROLES)).toBe(true);
  });

  it('sends plain Members back to the alliance home', async () => {
    selected.set(alliance('Member'));
    const result = await run(MANAGER_ROLES);
    expect(result instanceof UrlTree && result.toString()).toBe('/alliance');
  });

  it('allows routes without role restrictions', async () => {
    selected.set(alliance('Member'));
    expect(await run()).toBe(true);
  });

  it('allows any route when the user has no alliance yet', async () => {
    selected.set(null);
    expect(await run(MANAGER_ROLES)).toBe(true);
  });
});
