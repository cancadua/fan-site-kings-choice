import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import {
  AllianceSearchResult,
  LinkRequest,
  LinkRequestStatus,
  UnlinkedPlayer,
} from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

type LinkTab = 'code' | 'request';

interface SearchState {
  results: AllianceSearchResult[];
  error: string | null;
}

const MIN_SEARCH_LENGTH = 2;

/** Badge modifier per request status (Pending uses the default amber). */
const STATUS_BADGE: Record<LinkRequestStatus, string> = {
  Pending: '',
  Accepted: 'badge--success',
  Rejected: 'badge--danger',
  Cancelled: 'badge--muted',
};

/** Lets any signed-in user link their account to an alliance player and follow their requests. */
@Component({
  selector: 'app-alliance-link-account',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './alliance-link-account.component.html',
  styleUrls: ['./alliance-link-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceLinkAccountComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);
  private readonly router = inject(Router);

  readonly messageMaxLength = 500;
  readonly minSearchLength = MIN_SEARCH_LENGTH;

  tab = signal<LinkTab>('code');

  // "I have a code"
  code = signal('');
  claiming = signal(false);
  claimError = signal<string | null>(null);

  // "Request a link"
  query = signal('');
  private readonly search = toSignal(
    toObservable(this.query).pipe(
      map((q) => q.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) =>
        q.length < MIN_SEARCH_LENGTH
          ? of<SearchState>({ results: [], error: null })
          : this.api.searchAlliances(q).pipe(
              map((results): SearchState => ({ results, error: null })),
              catchError((err: unknown) =>
                of<SearchState>({ results: [], error: apiErrorMessage(err) })
              )
            )
      )
    ),
    { initialValue: { results: [], error: null } as SearchState }
  );
  readonly searchResults = computed(() => this.search().results);
  readonly searchError = computed(() => this.search().error);

  alliance = signal<AllianceSearchResult | null>(null);
  players = signal<UnlinkedPlayer[]>([]);
  playersLoading = signal(false);
  player = signal<UnlinkedPlayer | null>(null);
  message = signal('');
  sending = signal(false);
  requestError = signal<string | null>(null);
  requestSent = signal<string | null>(null);

  // "My requests"
  requests = signal<LinkRequest[]>([]);
  requestsLoading = signal(false);
  requestsError = signal<string | null>(null);

  constructor() {
    void this.loadRequests();
  }

  statusBadge(status: LinkRequestStatus): string {
    return STATUS_BADGE[status];
  }

  async claim(): Promise<void> {
    const code = this.code().trim();
    if (!code || this.claiming()) return;

    this.claiming.set(true);
    this.claimError.set(null);
    try {
      const player = await firstValueFrom(this.api.claimPlayer(code));
      await this.state.load();
      this.state.select(player.allianceId);
      this.code.set('');
      await this.router.navigate(['/alliance']);
    } catch (err) {
      this.claimError.set(apiErrorMessage(err));
    } finally {
      this.claiming.set(false);
    }
  }

  async chooseAlliance(alliance: AllianceSearchResult): Promise<void> {
    this.alliance.set(alliance);
    this.player.set(null);
    this.players.set([]);
    this.requestError.set(null);
    this.requestSent.set(null);
    this.playersLoading.set(true);
    try {
      const players = await firstValueFrom(
        this.api.unlinkedPlayers(alliance.id)
      );
      if (this.alliance()?.id === alliance.id) this.players.set(players);
    } catch (err) {
      this.requestError.set(apiErrorMessage(err));
    } finally {
      this.playersLoading.set(false);
    }
  }

  changeAlliance(): void {
    this.alliance.set(null);
    this.player.set(null);
    this.players.set([]);
    this.message.set('');
    this.requestError.set(null);
  }

  async sendRequest(): Promise<void> {
    const alliance = this.alliance();
    const player = this.player();
    if (!alliance || !player || this.sending()) return;

    this.sending.set(true);
    this.requestError.set(null);
    try {
      const message = this.message().trim();
      await firstValueFrom(
        this.api.createLinkRequest({
          allianceId: alliance.id,
          playerId: player.id,
          message: message || undefined,
        })
      );
      this.changeAlliance();
      this.query.set('');
      this.requestSent.set(
        `Request sent. A leader of ${alliance.name} will review it.`
      );
      await this.loadRequests();
    } catch (err) {
      this.requestError.set(apiErrorMessage(err));
    } finally {
      this.sending.set(false);
    }
  }

  async withdraw(request: LinkRequest): Promise<void> {
    if (!confirm(`Withdraw your request for ${request.playerName}?`)) return;
    this.requestsError.set(null);
    try {
      await firstValueFrom(this.api.cancelLinkRequest(request.id));
      await this.loadRequests();
    } catch (err) {
      this.requestsError.set(apiErrorMessage(err));
    }
  }

  private async loadRequests(): Promise<void> {
    this.requestsLoading.set(true);
    try {
      this.requests.set(await firstValueFrom(this.api.myLinkRequests()));
    } catch (err) {
      this.requestsError.set(apiErrorMessage(err));
    } finally {
      this.requestsLoading.set(false);
    }
  }
}
