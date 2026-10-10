import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { AllianceStateService } from '../alliance-state.service';
import { AllianceLinkHistoryComponent } from './alliance-link-history.component';

const base = environment.apiUrl;

describe('AllianceLinkHistoryComponent', () => {
  it('shows link log entries with readable method labels', async () => {
    await TestBed.configureTestingModule({
      imports: [AllianceLinkHistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const http = TestBed.inject(HttpTestingController);
    const state = TestBed.inject(AllianceStateService);
    const loaded = state.load();
    http.expectOne(`${base}/api/alliances`).flush([
      {
        id: 'a1',
        name: 'Knights',
        ownerId: 'u1',
        myRole: 'Owner',
        createdAt: '2026-01-01T00:00:00Z',
        memberCount: 2,
        myPlayerId: null,
        myPlayerName: null,
      },
    ]);
    await loaded;

    const fixture = TestBed.createComponent(AllianceLinkHistoryComponent);
    fixture.detectChanges();
    http.expectOne(`${base}/api/alliances/a1/link-log`).flush([
      {
        id: 'l1',
        playerId: 'p1',
        playerName: 'Arthur',
        userId: 'u2',
        username: 'lance',
        action: 'Unlinked',
        method: 'MemberRemoved',
        actorId: 'u1',
        actorUsername: 'owner',
        createdAt: '2026-10-01T10:00:00Z',
      },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const row = (fixture.nativeElement as HTMLElement).querySelector(
      'tbody tr'
    );
    expect(row?.textContent).toContain('Unlinked');
    expect(row?.textContent).toContain('removed from alliance');
    expect(row?.textContent).toContain('lance');
    expect(row?.textContent).toContain('owner');
    http.verify();
  });
});
