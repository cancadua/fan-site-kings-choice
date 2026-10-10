import { RewardType } from '../../core/api/api.models';

/** MVP tiers, lowest first. Every reward is an MVP of one of these tiers. */
export const MVP_TIERS: readonly RewardType[] = ['Normal', 'Earl', 'Duke'];

/** Badge modifier per tier: Earl blue, Duke purple, Normal neutral. */
export const MVP_TIER_BADGE: Record<RewardType, string> = {
  Normal: 'badge--muted',
  Earl: 'badge--earl',
  Duke: 'badge--duke',
};

/** Today's date as yyyy-mm-dd in the user's time zone (for <input type="date">). */
export function todayIsoDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
