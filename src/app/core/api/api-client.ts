import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Alliance,
  AllianceEvent,
  AllianceSearchResult,
  AllianceStats,
  AuthResponse,
  CreateEventRequest,
  CreateLinkRequestRequest,
  CreatePlayerRequest,
  CreateRewardRequest,
  InviteRequest,
  LinkCode,
  LinkRequest,
  LinkRequestStatus,
  LoginRequest,
  Me,
  Member,
  MvpRecommendation,
  MyAlliance,
  Player,
  PlayerLinkLogEntry,
  RegisterRequest,
  PatchSharedMapRequest,
  Reward,
  SharedMap,
  SharedMapState,
  UnlinkedPlayer,
  UpdateEventRequest,
  UpdatePlayerRequest,
  AllianceRole,
} from './api.models';

/** Extracts the API's `{ error }` / ProblemDetails message from a failed request. */
export function apiErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0)
      return 'Cannot reach the server. Try again in a moment.';
    if (err.status === 429)
      return 'Too many attempts. Try again in a few minutes.';
    const body: unknown = err.error;
    const { error, title } =
      body && typeof body === 'object'
        ? (body as { error?: unknown; title?: unknown })
        : {};
    if (typeof error === 'string') return error;
    // 403/404 usually come without an { error } body.
    if (err.status === 403) return "You don't have permission to do that.";
    if (err.status === 404) return "Not found, or you don't have access to it.";
    if (typeof title === 'string') return title;
  }
  return 'Something went wrong.';
}

/** True when the request failed with the given HTTP status. */
export function isHttpStatus(err: unknown, status: number): boolean {
  return err instanceof HttpErrorResponse && err.status === status;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // Auth
  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/api/auth/register`, req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/api/auth/login`, req);
  }

  me(): Observable<Me> {
    return this.http.get<Me>(`${this.base}/api/auth/me`);
  }

  // Alliances
  myAlliances(): Observable<MyAlliance[]> {
    return this.http.get<MyAlliance[]>(`${this.base}/api/alliances`);
  }

  createAlliance(name: string): Observable<Alliance> {
    return this.http.post<Alliance>(`${this.base}/api/alliances`, { name });
  }

  /** Finds alliances by name (min. 2 characters, max. 20 results). */
  searchAlliances(name: string): Observable<AllianceSearchResult[]> {
    return this.http.get<AllianceSearchResult[]>(
      `${this.base}/api/alliances/search`,
      { params: new HttpParams().set('name', name) }
    );
  }

  /** Players of any alliance that have no linked account yet. */
  unlinkedPlayers(allianceId: string): Observable<UnlinkedPlayer[]> {
    return this.http.get<UnlinkedPlayer[]>(
      `${this.base}/api/alliances/${allianceId}/unlinked-players`
    );
  }

  linkLog(allianceId: string): Observable<PlayerLinkLogEntry[]> {
    return this.http.get<PlayerLinkLogEntry[]>(
      `${this.base}/api/alliances/${allianceId}/link-log`
    );
  }

  members(allianceId: string): Observable<Member[]> {
    return this.http.get<Member[]>(
      `${this.base}/api/alliances/${allianceId}/members`
    );
  }

  invite(allianceId: string, req: InviteRequest): Observable<void> {
    return this.http.post<void>(
      `${this.base}/api/alliances/${allianceId}/invite`,
      req
    );
  }

  changeMemberRole(
    allianceId: string,
    userId: string,
    role: AllianceRole
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.base}/api/alliances/${allianceId}/members/${userId}`,
      { role }
    );
  }

  removeMember(allianceId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/api/alliances/${allianceId}/members/${userId}`
    );
  }

  // Players
  players(allianceId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.base}/api/players`, {
      params: this.allianceParam(allianceId),
    });
  }

  createPlayer(req: CreatePlayerRequest): Observable<Player> {
    return this.http.post<Player>(`${this.base}/api/players`, req);
  }

  updatePlayer(id: string, req: UpdatePlayerRequest): Observable<Player> {
    return this.http.patch<Player>(`${this.base}/api/players/${id}`, req);
  }

  /**
   * Fails with 409 when the player has a linked account; repeat with
   * `confirm` to delete it anyway (the account then also leaves the alliance).
   */
  deletePlayer(id: string, confirm = false): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/players/${id}`, {
      params: confirm ? new HttpParams().set('confirm', true) : undefined,
    });
  }

  /** Creates a one-time link code for an unlinked player; the previous code stops working. */
  createLinkCode(playerId: string): Observable<LinkCode> {
    return this.http.post<LinkCode>(
      `${this.base}/api/players/${playerId}/link-code`,
      {}
    );
  }

  /** Links the current account to the player the code was issued for. */
  claimPlayer(code: string): Observable<Player> {
    return this.http.post<Player>(`${this.base}/api/players/claim`, { code });
  }

  unlinkPlayer(playerId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/players/${playerId}/link`);
  }

  // Link requests
  createLinkRequest(req: CreateLinkRequestRequest): Observable<LinkRequest> {
    return this.http.post<LinkRequest>(`${this.base}/api/link-requests`, req);
  }

  /** The current user's requests, newest first. */
  myLinkRequests(): Observable<LinkRequest[]> {
    return this.http.get<LinkRequest[]>(`${this.base}/api/link-requests/mine`);
  }

  cancelLinkRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/link-requests/${id}`);
  }

  /** Requests for an alliance (Owner/Leader), oldest first. */
  allianceLinkRequests(
    allianceId: string,
    status: LinkRequestStatus = 'Pending'
  ): Observable<LinkRequest[]> {
    return this.http.get<LinkRequest[]>(`${this.base}/api/link-requests`, {
      params: this.allianceParam(allianceId).set('status', status),
    });
  }

  acceptLinkRequest(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.base}/api/link-requests/${id}/accept`,
      {}
    );
  }

  rejectLinkRequest(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.base}/api/link-requests/${id}/reject`,
      {}
    );
  }

  // Events
  events(allianceId: string): Observable<AllianceEvent[]> {
    return this.http.get<AllianceEvent[]>(`${this.base}/api/events`, {
      params: this.allianceParam(allianceId),
    });
  }

  createEvent(req: CreateEventRequest): Observable<AllianceEvent> {
    return this.http.post<AllianceEvent>(`${this.base}/api/events`, req);
  }

  updateEvent(id: string, req: UpdateEventRequest): Observable<AllianceEvent> {
    return this.http.patch<AllianceEvent>(`${this.base}/api/events/${id}`, req);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/events/${id}`);
  }

  // Rewards
  rewards(allianceId: string): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.base}/api/rewards`, {
      params: this.allianceParam(allianceId),
    });
  }

  playerRewards(playerId: string): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${this.base}/api/rewards/player/${playerId}`
    );
  }

  createReward(req: CreateRewardRequest): Observable<Reward> {
    return this.http.post<Reward>(`${this.base}/api/rewards`, req);
  }

  deleteReward(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/rewards/${id}`);
  }

  // Stats and recommendations
  stats(allianceId: string): Observable<AllianceStats> {
    return this.http.get<AllianceStats>(`${this.base}/api/stats/${allianceId}`);
  }

  mvpRecommendations(
    allianceId: string,
    top?: number
  ): Observable<MvpRecommendation[]> {
    let params = this.allianceParam(allianceId);
    if (top) params = params.set('top', top);
    return this.http.get<MvpRecommendation[]>(
      `${this.base}/api/recommendations/mvp`,
      { params }
    );
  }

  // Shared maps (no login needed)
  createSharedMap(state?: SharedMapState): Observable<SharedMap> {
    return this.http.post<SharedMap>(`${this.base}/api/shared-maps`, {
      state,
    });
  }

  /** Emits null when the map has not changed since `knownVersion` (304). */
  sharedMap(code: string, knownVersion?: number): Observable<SharedMap | null> {
    const headers =
      knownVersion === undefined
        ? undefined
        : new HttpHeaders().set('If-None-Match', `"${knownVersion}"`);
    return this.http
      .get<SharedMap>(this.sharedMapUrl(code), { headers })
      .pipe(
        catchError((err: unknown) =>
          isHttpStatus(err, 304) ? of(null) : throwError(() => err)
        )
      );
  }

  /** Sets or removes top-level state keys; other keys are left as they are. */
  patchSharedMap(
    code: string,
    req: PatchSharedMapRequest
  ): Observable<SharedMap> {
    return this.http.patch<SharedMap>(this.sharedMapUrl(code), req);
  }

  private sharedMapUrl(code: string): string {
    return `${this.base}/api/shared-maps/${encodeURIComponent(code)}`;
  }

  private allianceParam(allianceId: string): HttpParams {
    return new HttpParams().set('allianceId', allianceId);
  }
}
