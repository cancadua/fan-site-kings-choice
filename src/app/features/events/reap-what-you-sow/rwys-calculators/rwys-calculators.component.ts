import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AppIconComponent } from '../../../../shared/app-icon/app-icon.component';
import {
  MOVES_PER_DAY,
  RWYS_RULES,
  delegationBonus,
  expPerDay,
  minutesUntilFull,
  staminaAfter,
} from './rwys-formulas';

const STORAGE_KEY = 'kc.rwys.calculators';

interface SavedState {
  talents?: unknown;
  talentsPerPercent?: unknown;
}

/** Clamps a typed value into range; empty or invalid input counts as `min`. */
const clamp = (value: number, min: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

const formatNumber = (value: number): string =>
  Math.round(value).toLocaleString('en-US');

/** "2 h 30 min", "45 min" or "now". */
const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return 'now';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

/**
 * Reap What You Sow calculators: when stamina overflows (moves) and how much
 * exploration bonus the delegated knights give (knight strength). The rules
 * live in `rwys-formulas.ts`; knights and the talent ratio are remembered.
 */
@Component({
  selector: 'app-rwys-calculators',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './rwys-calculators.component.html',
  styleUrl: './rwys-calculators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RwysCalculatorsComponent {
  protected readonly rules = RWYS_RULES;
  protected readonly movesPerDay = MOVES_PER_DAY;
  protected readonly formatNumber = formatNumber;
  protected readonly formatDuration = formatDuration;

  // ---------- Moves (stamina) ----------
  protected readonly stamina = signal(12);
  protected readonly minutesToTick = signal<number>(
    RWYS_RULES.regenEveryMinutes
  );
  protected readonly hoursAway = signal(8);
  /** Current time, browser only; refreshed every minute for the "at 16:45" hints. */
  private readonly now = signal<Date | null>(null);

  protected readonly minutesToFull = computed(() =>
    minutesUntilFull(this.stamina(), this.minutesToTick())
  );
  protected readonly afterAway = computed(() =>
    staminaAfter(this.stamina(), this.minutesToTick(), this.hoursAway() * 60)
  );
  protected readonly fullAt = computed(() =>
    this.clockIn(this.minutesToFull())
  );
  protected readonly backAt = computed(() =>
    this.clockIn(this.hoursAway() * 60)
  );

  // ---------- Knight strength (delegation) ----------
  protected readonly talents = signal<number[]>(
    Array.from({ length: RWYS_RULES.maxDelegatedKnights }, () => 0)
  );
  protected readonly talentsPerPercent = signal<number>(
    RWYS_RULES.talentsPerBonusPercent
  );
  protected readonly isCustomRatio = computed(
    () => this.talentsPerPercent() !== RWYS_RULES.talentsPerBonusPercent
  );
  protected readonly delegation = computed(() =>
    delegationBonus(this.talents(), this.talentsPerPercent())
  );
  protected readonly bonusFill = computed(
    () => `scaleX(${this.delegation().applied / RWYS_RULES.maxDelegationBonus})`
  );
  protected readonly dailyExp = computed(() =>
    expPerDay(this.delegation().applied)
  );

  /** Calibration: Total Talents and bonus % read from the game. */
  protected readonly sampleTalents = signal(0);
  protected readonly sampleBonus = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.restore();
      this.now.set(new Date());
      const timer = setInterval(() => this.now.set(new Date()), 60_000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected setStamina(event: Event): void {
    this.stamina.set(clamp(this.read(event), 0, 999));
  }

  protected setMinutesToTick(event: Event): void {
    this.minutesToTick.set(
      clamp(this.read(event), 0, RWYS_RULES.regenEveryMinutes)
    );
  }

  protected setHoursAway(event: Event): void {
    this.hoursAway.set(clamp(this.read(event), 0, 48));
  }

  protected setTalent(index: number, event: Event): void {
    const next = [...this.talents()];
    next[index] = clamp(this.read(event), 0, 1_000_000);
    this.talents.set(next);
    this.save();
  }

  protected setRatio(event: Event): void {
    this.talentsPerPercent.set(clamp(this.read(event), 1, 1_000_000));
    this.save();
  }

  protected setSampleTalents(event: Event): void {
    this.sampleTalents.set(clamp(this.read(event), 0, 1_000_000));
  }

  protected setSampleBonus(event: Event): void {
    this.sampleBonus.set(clamp(this.read(event), 0, 100));
  }

  /** Derives the ratio from one in-game reading, e.g. 1,500 talents → 15%. */
  protected applySample(): void {
    if (!this.sampleTalents() || !this.sampleBonus()) return;
    this.talentsPerPercent.set(
      Math.round((this.sampleTalents() / this.sampleBonus()) * 100) / 100
    );
    this.save();
  }

  protected resetRatio(): void {
    this.talentsPerPercent.set(RWYS_RULES.talentsPerBonusPercent);
    this.save();
  }

  private read(event: Event): number {
    return (event.target as HTMLInputElement).valueAsNumber;
  }

  private clockIn(minutes: number): string | null {
    const now = this.now();
    if (!now) return null;
    return new Date(now.getTime() + minutes * 60_000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Storage can be blocked or hold old data, so every read is validated.
  private restore(): void {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '{}'
      ) as SavedState;
      if (
        Array.isArray(saved.talents) &&
        saved.talents.length === RWYS_RULES.maxDelegatedKnights &&
        saved.talents.every((t) => typeof t === 'number' && t >= 0)
      ) {
        this.talents.set(saved.talents as number[]);
      }
      if (
        typeof saved.talentsPerPercent === 'number' &&
        saved.talentsPerPercent > 0
      ) {
        this.talentsPerPercent.set(saved.talentsPerPercent);
      }
    } catch {
      // ignore
    }
  }

  private save(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          talents: this.talents(),
          talentsPerPercent: this.talentsPerPercent(),
        })
      );
    } catch {
      // ignore
    }
  }
}
