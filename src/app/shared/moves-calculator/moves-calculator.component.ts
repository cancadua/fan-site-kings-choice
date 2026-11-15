import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import {
  MovesRules,
  minutesUntilFull,
  movesAfter,
  movesPerDay,
} from './moves-formulas';

/** Clamps a typed value into range; empty or invalid input counts as `min`. */
const clamp = (value: number, min: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

/** "2 h 30 min", "45 min" or "now". */
const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return 'now';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

/**
 * Moves calculator for any event whose moves refill on a timer: when they hit
 * the cap, how many are left after a break and how many would be wasted.
 * Each event passes its own rules (cap, refill amount and interval).
 */
@Component({
  selector: 'app-moves-calculator',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './moves-calculator.component.html',
  styleUrl: './moves-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovesCalculatorComponent {
  readonly rules = input.required<MovesRules>();

  protected readonly formatDuration = formatDuration;

  protected readonly current = signal(0);
  protected readonly minutesToTick = signal(0);
  protected readonly hoursAway = signal(8);
  /** Current time, browser only; refreshed every minute for the "at 16:45" hints. */
  private readonly now = signal<Date | null>(null);

  protected readonly minutesToFull = computed(() =>
    minutesUntilFull(this.rules(), this.current(), this.minutesToTick())
  );
  protected readonly afterAway = computed(() =>
    movesAfter(
      this.rules(),
      this.current(),
      this.minutesToTick(),
      this.hoursAway() * 60
    )
  );
  protected readonly perDay = computed(() => movesPerDay(this.rules()));
  protected readonly fullAt = computed(() =>
    this.clockIn(this.minutesToFull())
  );
  protected readonly backAt = computed(() =>
    this.clockIn(this.hoursAway() * 60)
  );

  constructor() {
    // Start from a typical half-spent state for the event's own numbers.
    effect(() => {
      const rules = this.rules();
      this.current.set(Math.floor(rules.max / 2));
      this.minutesToTick.set(rules.everyMinutes);
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.now.set(new Date());
      const timer = setInterval(() => this.now.set(new Date()), 60_000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected setCurrent(event: Event): void {
    this.current.set(clamp(this.read(event), 0, 9999));
  }

  protected setMinutesToTick(event: Event): void {
    this.minutesToTick.set(
      clamp(this.read(event), 0, this.rules().everyMinutes)
    );
  }

  protected setHoursAway(event: Event): void {
    this.hoursAway.set(clamp(this.read(event), 0, 48));
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
}
