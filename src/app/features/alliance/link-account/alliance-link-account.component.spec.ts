import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { LinkRequest } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';
import { AllianceLinkAccountComponent } from './alliance-link-account.component';

const base = environment.apiUrl;

describe('AllianceLinkAccountComponent', () => {
  let fixture: ComponentFixture<AllianceLinkAccountComponent>;
  let component: AllianceLinkAccountComponent;
  let http: HttpTestingController;
  let state: AllianceStateService;
  let router: Router;

  const pending: LinkRequest = {
    id: 'r1',
    allianceId: 'a1',
    allianceName: 'Knights',
    playerId: 'p1',
    playerName: 'Arthur',
    userId: 'u1',
    username: 'arthur',
    message: null,
    status: 'Pending',
    createdAt: '2026-10-01T10:00:00Z',
    resolvedAt: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllianceLinkAccountComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    state = TestBed.inject(AllianceStateService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(AllianceLinkAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(`${base}/api/link-requests/mine`).flush([pending]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('lists my requests with a withdraw action for pending ones', () => {
    fixture.detectChanges();
    const row = (fixture.nativeElement as HTMLElement).querySelector(
      'tbody tr'
    );
    expect(row?.textContent).toContain('Knights');
    expect(row?.textContent).toContain('Pending');
    expect(row?.querySelector('button')?.textContent).toContain('Withdraw');
  });

  it('claims a code, reloads alliances and opens the alliance', async () => {
    component.code.set('k7qx-92pm');
    const done = component.claim();

    const claim = http.expectOne(`${base}/api/players/claim`);
    expect(claim.request.body).toEqual({ code: 'k7qx-92pm' });
    claim.flush({ id: 'p1', allianceId: 'a2' });
    await Promise.resolve();
    await Promise.resolve();
    http.expectOne(`${base}/api/alliances`).flush([]);
    await done;

    expect(state.loaded()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/alliance']);
  });

  it('shows the API error when the code is wrong', async () => {
    component.code.set('NOPE-NOPE');
    const done = component.claim();
    http
      .expectOne(`${base}/api/players/claim`)
      .flush(
        { error: 'The code is invalid or has expired.' },
        { status: 400, statusText: 'Bad Request' }
      );
    await done;

    expect(component.claimError()).toBe('The code is invalid or has expired.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('sends a link request for the chosen player', async () => {
    const choose = component.chooseAlliance({ id: 'a1', name: 'Knights' });
    http
      .expectOne(`${base}/api/alliances/a1/unlinked-players`)
      .flush([{ id: 'p1', name: 'Arthur' }]);
    await choose;

    component.player.set(component.players()[0]);
    component.message.set('  It is me  ');
    const send = component.sendRequest();
    const req = http.expectOne(`${base}/api/link-requests`);
    expect(req.request.body).toEqual({
      allianceId: 'a1',
      playerId: 'p1',
      message: 'It is me',
    });
    req.flush(pending, { status: 201, statusText: 'Created' });
    await Promise.resolve();
    await Promise.resolve();
    http.expectOne(`${base}/api/link-requests/mine`).flush([pending]);
    await send;

    expect(component.requestSent()).toContain('Knights');
    expect(component.alliance()).toBeNull();
  });

  it('withdraws a pending request after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const done = component.withdraw(pending);
    const req = http.expectOne(`${base}/api/link-requests/r1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await Promise.resolve();
    await Promise.resolve();
    http
      .expectOne(`${base}/api/link-requests/mine`)
      .flush([{ ...pending, status: 'Cancelled' }]);
    await done;

    expect(component.requests()[0].status).toBe('Cancelled');
  });
});
