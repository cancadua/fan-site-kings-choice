/** How an event's moves refill: a cap and a fixed amount every few minutes. */
export interface MovesRules {
  /** What the game calls it, lower case: "moves", "stamina"… */
  resource: string;
  max: number;
  /** Refilled per tick. */
  amount: number;
  /** Minutes between ticks. */
  everyMinutes: number;
}

const MINUTES_PER_DAY = 24 * 60;

/** Minutes until the cap is reached, given minutes left until the next tick. */
export function minutesUntilFull(
  rules: MovesRules,
  current: number,
  minutesToNextTick: number
): number {
  const missing = rules.max - current;
  if (missing <= 0) return 0;
  const ticks = Math.ceil(missing / rules.amount);
  return minutesToNextTick + (ticks - 1) * rules.everyMinutes;
}

/** Moves after being away, and how much refill was lost to the cap. */
export function movesAfter(
  rules: MovesRules,
  current: number,
  minutesToNextTick: number,
  minutesAway: number
): { moves: number; wasted: number } {
  const ticks =
    minutesAway < minutesToNextTick
      ? 0
      : 1 + Math.floor((minutesAway - minutesToNextTick) / rules.everyMinutes);
  const gained = ticks * rules.amount;
  if (current >= rules.max) return { moves: current, wasted: gained };
  const total = current + gained;
  return {
    moves: Math.min(rules.max, total),
    wasted: Math.max(0, total - rules.max),
  };
}

/** Moves a fully active player gets per day from refills alone. */
export function movesPerDay(rules: MovesRules): number {
  return (MINUTES_PER_DAY / rules.everyMinutes) * rules.amount;
}
