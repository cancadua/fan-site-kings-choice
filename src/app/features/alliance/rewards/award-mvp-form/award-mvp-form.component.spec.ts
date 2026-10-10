import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../../environments/environment';
import { todayIsoDate } from '../../mvp-tiers';
import { AwardMvpFormComponent } from './award-mvp-form.component';

const base = environment.apiUrl;

describe('AwardMvpFormComponent', () => {
  let fixture: ComponentFixture<AwardMvpFormComponent>;
  let component: AwardMvpFormComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardMvpFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AwardMvpFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('players', [{ id: 'p1', name: 'Arthur' }]);
    fixture.componentRef.setInput('events', [
      { id: 'e1', allianceId: 'a1', name: 'Showdown', description: null },
    ]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('defaults to a Normal MVP dated today', () => {
    expect(component.tier()).toBe('Normal');
    expect(component.date()).toBe(todayIsoDate());
    expect(component.eventId()).toBe('');
  });

  it('awards today without a date so the server stamps the time', async () => {
    const awarded = vi.fn();
    component.awarded.subscribe(awarded);
    component.playerId.set('p1');
    component.tier.set('Duke');

    const done = component.submit();
    const req = http.expectOne(`${base}/api/rewards`);
    expect(req.request.body).toEqual({
      playerId: 'p1',
      type: 'Duke',
      eventId: null,
      awardedAt: undefined,
    });
    req.flush({});
    await done;

    expect(awarded).toHaveBeenCalled();
    expect(component.tier()).toBe('Normal');
    expect(component.playerId()).toBe('');
  });

  it('sends the chosen event and an earlier date', async () => {
    component.playerId.set('p1');
    component.tier.set('Earl');
    component.eventId.set('e1');
    component.date.set('2026-09-01');

    const done = component.submit();
    const req = http.expectOne(`${base}/api/rewards`);
    expect(req.request.body).toEqual({
      playerId: 'p1',
      type: 'Earl',
      eventId: 'e1',
      awardedAt: new Date('2026-09-01').toISOString(),
    });
    req.flush({});
    await done;
  });

  it('keeps the player when it is locked', async () => {
    fixture.componentRef.setInput('lockPlayer', true);
    component.playerId.set('p1');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'select[name="player"]'
      )
    ).toBeNull();

    const done = component.submit();
    http.expectOne(`${base}/api/rewards`).flush({});
    await done;
    expect(component.playerId()).toBe('p1');
  });

  it('shows the API error', async () => {
    component.playerId.set('p1');
    const done = component.submit();
    http
      .expectOne(`${base}/api/rewards`)
      .flush(
        { error: 'Player not found.' },
        { status: 404, statusText: 'Not Found' }
      );
    await done;
    expect(component.error()).toBe('Player not found.');
  });
});
