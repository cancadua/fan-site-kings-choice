/**
 * Reap What You Sow rules behind the calculators. The stamina figures come from
 * the guide's Basic Information tab.
 *
 * ⚠ `talentsPerBonusPercent` is an UNVERIFIED estimate: the delegation bonus is
 * assumed to grow linearly with the delegated knights' combined Total Talents,
 * capped at `maxDelegationBonus`. Change the number (or `delegationBonus`) when
 * in-game results disagree. Visitors can also override the ratio on the page.
 */
export const RWYS_RULES = {
  maxStamina: 28,
  regenAmount: 4,
  regenEveryMinutes: 30,
  expPerExplore: 100,
  maxDelegatedKnights: 4,
  /** Percent. */
  maxDelegationBonus: 20,
  /** Total Talents needed for +1% exploration EXP. UNVERIFIED. */
  talentsPerBonusPercent: 100,
} as const;

const MINUTES_PER_DAY = 24 * 60;

/** Minutes until stamina hits the cap, given minutes left until the next refill tick. */
export function minutesUntilFull(
  current: number,
  minutesToNextTick: number
): number {
  const missing = RWYS_RULES.maxStamina - current;
  if (missing <= 0) return 0;
  const ticks = Math.ceil(missing / RWYS_RULES.regenAmount);
  return minutesToNextTick + (ticks - 1) * RWYS_RULES.regenEveryMinutes;
}

/** Stamina after being away, and how much refill was lost to the cap. */
export function staminaAfter(
  current: number,
  minutesToNextTick: number,
  minutesAway: number
): { stamina: number; wasted: number } {
  const ticks =
    minutesAway < minutesToNextTick
      ? 0
      : 1 +
        Math.floor(
          (minutesAway - minutesToNextTick) / RWYS_RULES.regenEveryMinutes
        );
  const gained = ticks * RWYS_RULES.regenAmount;
  if (current >= RWYS_RULES.maxStamina) {
    return { stamina: current, wasted: gained };
  }
  const total = current + gained;
  return {
    stamina: Math.min(RWYS_RULES.maxStamina, total),
    wasted: Math.max(0, total - RWYS_RULES.maxStamina),
  };
}

/** Explorations a fully active player can make per day from refills alone. */
export const MOVES_PER_DAY =
  (MINUTES_PER_DAY / RWYS_RULES.regenEveryMinutes) * RWYS_RULES.regenAmount;

/** Exploration EXP per day from refills, with the delegation bonus in percent. */
export function expPerDay(bonusPercent: number): number {
  return Math.round(
    MOVES_PER_DAY * RWYS_RULES.expPerExplore * (1 + bonusPercent / 100)
  );
}

export interface DelegationResult {
  /** Bonus before the cap, percent. */
  raw: number;
  /** Bonus that actually applies, percent. */
  applied: number;
  /** Talents needed for the full bonus. */
  talentsForCap: number;
  /** Talents above the cap (0 when under it). */
  surplus: number;
  /** Talents still missing for the cap (0 when reached). */
  missing: number;
  /** Index of the strongest knight that can be dropped while keeping the cap, if any. */
  spareKnight: number | null;
}

/** Delegation bonus from the delegated knights' Total Talents (assumed linear, see above). */
export function delegationBonus(
  talents: number[],
  talentsPerPercent: number
): DelegationResult {
  const total = talents.reduce((sum, t) => sum + t, 0);
  const talentsForCap = RWYS_RULES.maxDelegationBonus * talentsPerPercent;
  const raw = talentsPerPercent > 0 ? total / talentsPerPercent : 0;

  let spareKnight: number | null = null;
  for (let i = 0; i < talents.length; i++) {
    const t = talents[i];
    const strongerSpare = spareKnight === null || t > talents[spareKnight];
    if (t > 0 && total - t >= talentsForCap && strongerSpare) spareKnight = i;
  }

  return {
    raw,
    applied: Math.min(raw, RWYS_RULES.maxDelegationBonus),
    talentsForCap,
    surplus: Math.max(0, total - talentsForCap),
    missing: Math.max(0, talentsForCap - total),
    spareKnight,
  };
}
