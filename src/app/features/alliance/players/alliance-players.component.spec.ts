import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { environment } from '../../../../environments/environment';
import {
  AllianceRole,
  LinkRequest,
  MyAlliance,
  Player,
} from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';
import { AlliancePlayersComponent } from './alliance-players.component';

const base = environment.apiUrl;

const player = (overrides: Partial<Player> = {}): Player => ({
  id: 'p1',
  allianceId: 'a1',
  name: 'Arthur',
  activity: 50,
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  userId: null,
  username: null,
  ...overrides,
});

/** Lets pending promise continuations (and the HTTP calls they make) run. */
const settle = () => new Promise((resolve) => setTimeout(resolve));

describe('AlliancePlayersComponent', () => {
  let fixture: ComponentFixture<AlliancePlayersComponent>;
  let component: AlliancePlayersComponent;
  let http: HttpTestingController;

  const isPlayersList = (r: { url: string }) => r.url === `${base}/api/players`;

  /** Flushes the reloads that follow a link change. */
  const flushRefresh = async (players: Player[]) => {
    await settle();
    http.match(isPlayersList).forEach((r) => r.flush(players));
    http
      .match((r) => r.url === `${base}/api/link-requests`)
      .forEach((r) => r.flush([]));
    http
      .match(`${base}/api/alliances`)
      .forEach((r) => r.flush([alliance('Owner')]));
    await settle();
  };

  const alliance = (myRole: AllianceRole): MyAlliance => ({
    id: 'a1',
    name: 'Knights',
    ownerId: 'u1',
    myRole,
    createdAt: '2026-01-01T00:00:00Z',
    memberCount: 2,
    myPlayerId: null,
    myPlayerName: null,
  });

  const setup = async (role: AllianceRole, players: Player[]) => {
    await TestBed.configureTestingModule({
      imports: [AlliancePlayersComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    const state = TestBed.inject(AllianceStateService);
    const loaded = state.load();
    http.expectOne(`${base}/api/alliances`).flush([alliance(role)]);
    await loaded;

    fixture = TestBed.createComponent(AlliancePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(isPlayersList).flush(players);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  afterEach(() => http.verify());

  it('shows whether each player has an account', async () => {
    await setup('Owner', [
      player(),
      player({ id: 'p2', name: 'Lancelot', userId: 'u2', username: 'lance' }),
    ]);
    const badges = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'tbody .badge'
    );
    expect(badges[0].textContent).toContain('No account');
    expect(badges[1].textContent).toContain('Account: lance');
  });

  it('asks again and deletes with confirm=true after a 409', async () => {
    const linked = player({ userId: 'u2', username: 'lance' });
    await setup('Owner', [linked]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await Promise.all([
      component.remove(linked),
      settle().then(() =>
        http
          .expectOne(`${base}/api/players/p1`)
          .flush({ error: 'Linked.' }, { status: 409, statusText: 'Conflict' })
      ),
    ]);
    expect(component.confirmDeletePlayer()).toBe(linked);
    expect(component.error()).toBeNull();

    const done = component.confirmDelete();
    await settle();
    const confirmed: TestRequest = http.expectOne(
      (r) => r.url === `${base}/api/players/p1`
    );
    expect(confirmed.request.params.get('confirm')).toBe('true');
    confirmed.flush(null);
    await flushRefresh([]);
    await done;

    expect(component.players()).toEqual([]);
    expect(component.info()).toContain('lance');
  });

  it('shows a generated code once', async () => {
    await setup('Leader', [player()]);
    const done = component.generateCode(player());
    http
      .expectOne(`${base}/api/players/p1/link-code`)
      .flush({ code: 'K7QX-92PM', expiresAt: '2026-10-17T10:00:00Z' });
    await done;
    fixture.detectChanges();

    expect(component.issuedCode()?.code.code).toBe('K7QX-92PM');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.link-code')
        ?.textContent
    ).toContain('K7QX-92PM');
  });

  it('always invites as Member when the user is a Leader', async () => {
    await setup('Leader', [player()]);
    component.openInvite(player());
    component.inviteUser.set('lance');
    component.inviteRole.set('Leader');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'dialog select[name="role"]'
      )
    ).toBeNull();

    const done = component.invite();
    const req = http.expectOne(`${base}/api/alliances/a1/invite`);
    expect(req.request.body).toEqual({
      user: 'lance',
      playerId: 'p1',
      role: 'Member',
    });
    req.flush(null, { status: 204, statusText: 'No Content' });
    await flushRefresh([player({ userId: 'u2', username: 'lance' })]);
    await done;

    expect(component.invitePlayer()).toBeNull();
    expect(component.players()[0].username).toBe('lance');
  });

  it('lets the Owner pick the Leader role', async () => {
    await setup('Owner', [player()]);
    component.openInvite(player());
    component.inviteUser.set('lance@example.com');
    component.inviteRole.set('Leader');

    const done = component.invite();
    const req = http.expectOne(`${base}/api/alliances/a1/invite`);
    expect(req.request.body.role).toBe('Leader');
    req.flush(
      { error: 'No registered user with that email or username.' },
      { status: 404, statusText: 'Not Found' }
    );
    await done;

    expect(component.inviteError()).toBe(
      'No registered user with that email or username.'
    );
    expect(component.invitePlayer()).not.toBeNull();
  });

  it('accepts a link request and refreshes players', async () => {
    await setup('Owner', [player()]);
    const request: LinkRequest = {
      id: 'r1',
      allianceId: 'a1',
      allianceName: 'Knights',
      playerId: 'p1',
      playerName: 'Arthur',
      userId: 'u2',
      username: 'lance',
      message: null,
      status: 'Pending',
      createdAt: '2026-10-01T00:00:00Z',
      resolvedAt: null,
    };

    const done = component.acceptRequest(request);
    http.expectOne(`${base}/api/link-requests/r1/accept`).flush(null);
    await flushRefresh([player({ userId: 'u2', username: 'lance' })]);
    await done;

    expect(component.players()[0].userId).toBe('u2');
    expect(component.info()).toContain('lance');
  });
});
