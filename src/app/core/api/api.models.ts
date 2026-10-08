// Mirrors AllianceRewards.Api DTOs. Enums are serialized as strings (JsonStringEnumConverter).
// Dates are ISO-8601 strings.

export type AllianceRole = 'Member' | 'Owner' | 'Leader';
export type RewardType = 'Normal' | 'Blue' | 'Purple' | 'Mvp';

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
}

export interface InviteRequest {
  email: string;
  role?: AllianceRole;
}

// Players
export interface Player {
  id: string;
  allianceId: string;
  name: string;
  activity: number;
  isActive: boolean;
  createdAt: string;
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

// Events
export interface AllianceEvent {
  id: string;
  allianceId: string;
  name: string;
  description: string | null;
  date: string;
}

export interface CreateEventRequest {
  allianceId: string;
  name: string;
  description?: string | null;
  date?: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string | null;
  date?: string;
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
  blue: number;
  purple: number;
  mvp: number;
  total: number;
  lastReward: string | null;
}

export interface RewardTotals {
  normal: number;
  blue: number;
  purple: number;
  mvp: number;
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
  lastReward: string | null;
  lastMvp: string | null;
  normalRewards: number;
  blueRewards: number;
  purpleRewards: number;
}
