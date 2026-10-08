import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Alliance,
  AllianceEvent,
  AllianceStats,
  AuthResponse,
  CreateEventRequest,
  CreatePlayerRequest,
  CreateRewardRequest,
  InviteRequest,
  LoginRequest,
  Me,
  Member,
  MvpRecommendation,
  MyAlliance,
  Player,
  RegisterRequest,
  Reward,
  UpdateEventRequest,
  UpdatePlayerRequest,
  AllianceRole,
} from './api.models';

/** Extracts the API's `{ error }` / ProblemDetails message from a failed request. */
export function apiErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Cannot reach the server. Try again in a moment.';
    if (err.status === 429) return 'Too many attempts. Wait a minute and try again.';
    const body: unknown = err.error;
    if (body && typeof body === 'object') {
      const { error, title } = body as { error?: unknown; title?: unknown };
      if (typeof error === 'string') return error;
      if (typeof title === 'string') return title;
    }
  }
  return 'Something went wrong.';
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

  members(allianceId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.base}/api/alliances/${allianceId}/members`);
  }

  invite(allianceId: string, req: InviteRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/api/alliances/${allianceId}/invite`, req);
  }

  changeMemberRole(allianceId: string, userId: string, role: AllianceRole): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/alliances/${allianceId}/members/${userId}`, { role });
  }

  removeMember(allianceId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/alliances/${allianceId}/members/${userId}`);
  }

  // Players
  players(allianceId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.base}/api/players`, { params: this.allianceParam(allianceId) });
  }

  createPlayer(req: CreatePlayerRequest): Observable<Player> {
    return this.http.post<Player>(`${this.base}/api/players`, req);
  }

  updatePlayer(id: string, req: UpdatePlayerRequest): Observable<Player> {
    return this.http.patch<Player>(`${this.base}/api/players/${id}`, req);
  }

  deletePlayer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/players/${id}`);
  }

  // Events
  events(allianceId: string): Observable<AllianceEvent[]> {
    return this.http.get<AllianceEvent[]>(`${this.base}/api/events`, { params: this.allianceParam(allianceId) });
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
    return this.http.get<Reward[]>(`${this.base}/api/rewards`, { params: this.allianceParam(allianceId) });
  }

  playerRewards(playerId: string): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.base}/api/rewards/player/${playerId}`);
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

  mvpRecommendations(allianceId: string, top?: number): Observable<MvpRecommendation[]> {
    let params = this.allianceParam(allianceId);
    if (top) params = params.set('top', top);
    return this.http.get<MvpRecommendation[]>(`${this.base}/api/recommendations/mvp`, { params });
  }

  private allianceParam(allianceId: string): HttpParams {
    return new HttpParams().set('allianceId', allianceId);
  }
}
