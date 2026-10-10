import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiClient, apiErrorMessage, isHttpStatus } from './api-client';

const base = environment.apiUrl;

describe('ApiClient', () => {
  let api: ApiClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends invites with user, playerId and role', async () => {
    const done = firstValueFrom(
      api.invite('a1', { user: 'bob', playerId: 'p1', role: 'Member' })
    );
    const req = http.expectOne(`${base}/api/alliances/a1/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      user: 'bob',
      playerId: 'p1',
      role: 'Member',
    });
    req.flush(null, { status: 204, statusText: 'No Content' });
    await done;
  });

  it('only adds ?confirm=true when deleting is confirmed', async () => {
    const plain = firstValueFrom(api.deletePlayer('p1'));
    const plainReq = http.expectOne(`${base}/api/players/p1`);
    expect(plainReq.request.params.has('confirm')).toBe(false);
    plainReq.flush(null);
    await plain;

    const confirmed = firstValueFrom(api.deletePlayer('p1', true));
    const confirmedReq = http.expectOne(
      (r) => r.url === `${base}/api/players/p1`
    );
    expect(confirmedReq.request.params.get('confirm')).toBe('true');
    confirmedReq.flush(null);
    await confirmed;
  });

  it('claims a player by code', async () => {
    const done = firstValueFrom(api.claimPlayer('K7QX-92PM'));
    const req = http.expectOne(`${base}/api/players/claim`);
    expect(req.request.body).toEqual({ code: 'K7QX-92PM' });
    req.flush({ id: 'p1', allianceId: 'a1' });
    expect((await done).allianceId).toBe('a1');
  });

  it('requests pending link requests of an alliance by default', async () => {
    const done = firstValueFrom(api.allianceLinkRequests('a1'));
    const req = http.expectOne((r) => r.url === `${base}/api/link-requests`);
    expect(req.request.params.get('allianceId')).toBe('a1');
    expect(req.request.params.get('status')).toBe('Pending');
    req.flush([]);
    expect(await done).toEqual([]);
  });

  it('searches alliances by name', async () => {
    const done = firstValueFrom(api.searchAlliances('kn'));
    const req = http.expectOne((r) => r.url === `${base}/api/alliances/search`);
    expect(req.request.params.get('name')).toBe('kn');
    req.flush([{ id: 'a1', name: 'Knights' }]);
    expect(await done).toEqual([{ id: 'a1', name: 'Knights' }]);
  });
});

describe('apiErrorMessage', () => {
  const error = (status: number, body: unknown = null) =>
    new HttpErrorResponse({ status, error: body });

  it('prefers the API error message', () => {
    expect(apiErrorMessage(error(409, { error: 'Already linked.' }))).toBe(
      'Already linked.'
    );
  });

  it('asks to retry later on rate limiting', () => {
    expect(apiErrorMessage(error(429))).toBe(
      'Too many attempts. Try again in a few minutes.'
    );
  });

  it('explains 403 and 404 without a body', () => {
    expect(apiErrorMessage(error(403))).toBe(
      "You don't have permission to do that."
    );
    expect(apiErrorMessage(error(404, { title: 'Not Found' }))).toBe(
      "Not found, or you don't have access to it."
    );
  });

  it('detects the status of a failed request', () => {
    expect(isHttpStatus(error(409), 409)).toBe(true);
    expect(isHttpStatus(error(404), 409)).toBe(false);
    expect(isHttpStatus(new Error('x'), 409)).toBe(false);
  });
});
