// Mirrors AllianceRewards.Api DTOs. Enums are serialized as strings (JsonStringEnumConverter).
// Dates are ISO-8601 strings.

export type AllianceRole = 'Member' | 'Owner' | 'Leader';
/** Every reward is an MVP; the type is its tier. */
export type RewardType = 'Normal' | 'Earl' | 'Duke';
export type LinkRequestStatus =
  'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
export type PlayerLinkAction = 'Linked' | 'Unlinked';
export type PlayerLinkMethod =
  'Code' | 'Invite' | 'Request' | 'Unlink' | 'MemberRemoved' | 'PlayerDeleted';

// Auth
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface Me {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

// Alliances
export interface MyAlliance {
  id: string;
  name: string;
  ownerId: string;
  myRole: AllianceRole;
  createdAt: string;
  memberCount: number;
  /** The player the current account is linked to in this alliance, if any. */
  myPlayerId: string | null;
  myPlayerName: string | null;
}

export interface Alliance {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  memberCount: number;
}

export interface Member {
  userId: string;
  username: string;
  email: string;
  role: AllianceRole;
  joinedAt: string;
  playerId: string | null;
  playerName: string | null;
}

/** Links a registered account to a player; only the Owner may grant Leader. */
export interface InviteRequest {
  /** Email or username of a registered account. */
  user: string;
  playerId: string;
  role?: Exclude<AllianceRole, 'Owner'>;
}

export interface AllianceSearchResult {
  id: string;
  name: string;
}

export interface UnlinkedPlayer {
  id: string;
  name: string;
}

export interface PlayerLinkLogEntry {
  id: string;
  playerId: string;
  playerName: string;
  userId: string;
  username: string | null;
  action: PlayerLinkAction;
  method: PlayerLinkMethod;
  actorId: string;
  actorUsername: string | null;
  createdAt: string;
}

// Players
export interface Player {
  id: string;
  allianceId: string;
  name: string;
  activity: number;
  isActive: boolean;
  createdAt: string;
  /** The linked account, if any. */
  userId: string | null;
  username: string | null;
}

/** One-time code; it is only ever returned by the request that created it. */
export interface LinkCode {
  code: string;
  expiresAt: string;
}

export interface CreatePlayerRequest {
  allianceId: string;
  name: string;
  activity?: number;
}

export interface UpdatePlayerRequest {
  name?: string;
  activity?: number;
  isActive?: boolean;
}

// Link requests
export interface LinkRequest {
  id: string;
  allianceId: string;
  allianceName: string;
  playerId: string | null;
  playerName: string;
  userId: string;
  username: string;
  message: string | null;
  status: LinkRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export interface CreateLinkRequestRequest {
  allianceId: string;
  playerId: string;
  message?: string;
}

// Events
export interface AllianceEvent {
  id: string;
  allianceId: string;
  name: string;
  description: string | null;
}

export interface CreateEventRequest {
  allianceId: string;
  name: string;
  description?: string | null;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string | null;
}

// Rewards
export interface Reward {
  id: string;
  playerId: string;
  playerName: string;
  eventId: string | null;
  type: RewardType;
  awardedAt: string;
}

export interface CreateRewardRequest {
  playerId: string;
  type: RewardType;
  eventId?: string | null;
  awardedAt?: string;
}

// Stats
export interface PlayerStats {
  playerId: string;
  player: string;
  isActive: boolean;
  normal: number;
  earl: number;
  duke: number;
  /** Number of MVPs of any tier. */
  total: number;
  lastReward: string | null;
}

export interface RewardTotals {
  normal: number;
  earl: number;
  duke: number;
  total: number;
}

export interface AllianceStats {
  allianceId: string;
  totals: RewardTotals;
  players: PlayerStats[];
}

// Recommendations
export interface MvpRecommendation {
  playerId: string;
  player: string;
  score: number;
  lastMvp: string | null;
  normalRewards: number;
  earlRewards: number;
  dukeRewards: number;
}
