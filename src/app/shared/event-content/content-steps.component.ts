import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  contentChildren,
  inject,
  input,
  signal,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { slugify } from '../utils/slug';
import { HeadingAnchorComponent } from './heading-anchor.component';

const STORAGE_PREFIX = 'kc.checklist.';

/**
 * A single numbered step. Leave `marker` unset to use the automatic number from
 * the parent <app-content-steps>, or pass a custom glyph (e.g. a roman numeral).
 * Inside a checklist (`checklist` set on the parent) it gets a tick box.
 */
@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [AppIconComponent, HeadingAnchorComponent],
  host: {
    class: 'reveal-on-scroll',
    '[class.ec-step--done]': 'done()',
    '[attr.id]': 'stepId()',
    '[attr.data-toc]': 'heading() || null',
  },
  template: `
    <div class="ec-step__header">
      <span class="ec-step__marker">{{ marker() }}</span>
      <h4 class="ec-step__title">
        {{ heading() }}
        <app-heading-anchor [anchorId]="stepId()" [label]="heading()" />
      </h4>
      @if (isChecklist()) {
        <label class="ec-step__check">
          <input
            type="checkbox"
            class="ec-step__input"
            [checked]="done()"
            (change)="toggle()"
          />
          <span class="ec-step__box" aria-hidden="true">
            <app-icon name="check" />
          </span>
          <span class="visually-hidden">Done: {{ heading() }}</span>
        </label>
      }
    </div>
    <div class="ec-step__body"><ng-content /></div>
  `,
  styleUrl: './content-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStepComponent {
  private readonly list = inject(ContentStepsComponent, { optional: true });

  readonly heading = input('');
  readonly marker = input('');

  /** Ticks are stored by this id, so reordering steps keeps them. */
  readonly stepId = computed(() => slugify(this.heading()));
  protected readonly isChecklist = computed(() => !!this.list?.checklist());
  protected readonly done = computed(
    () => this.list?.isDone(this.stepId()) ?? false
  );

  protected toggle(): void {
    this.list?.toggle(this.stepId());
  }
}

/**
 * Ordered container for <app-content-step> items. Drives automatic step
 * numbering via a CSS counter, so steps stay numbered correctly when reordered.
 *
 * Set `checklist` to a unique key to turn the steps into a checklist: each step
 * gets a tick box and progress is remembered in this browser.
 */
@Component({
  selector: 'app-content-steps',
  standalone: true,
  template: `
    @if (checklist()) {
      <div class="ec-progress">
        <span class="ec-progress__label">
          <strong>{{ doneCount() }}</strong> / {{ steps().length }} done
        </span>
        <span
          class="ec-progress__bar"
          role="progressbar"
          aria-label="Checklist progress"
          [attr.aria-valuenow]="doneCount()"
          aria-valuemin="0"
          [attr.aria-valuemax]="steps().length"
        >
          <span
            class="ec-progress__fill"
            [style.transform]="fillScale()"
          ></span>
        </span>
        @if (doneCount()) {
          <button type="button" class="ec-progress__reset" (click)="reset()">
            Reset
          </button>
        }
      </div>
    }
    <ng-content />
  `,
  styleUrl: './content-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStepsComponent {
  /** Storage key for the checklist; empty means a plain numbered list. */
  readonly checklist = input('');

  protected readonly steps = contentChildren(ContentStepComponent);
  private readonly done = signal<ReadonlySet<string>>(new Set());

  /** Counts only ticks that match a current step, so renamed steps drop out. */
  protected readonly doneCount = computed(() => {
    const done = this.done();
    return this.steps().filter((step) => done.has(step.stepId())).length;
  });
  protected readonly fillScale = computed(() => {
    const total = this.steps().length;
    return `scaleX(${total ? this.doneCount() / total : 0})`;
  });

  constructor() {
    // Storage exists only in the browser (and can be blocked), so ticks load after render.
    afterNextRender(() => {
      const key = this.checklist();
      if (!key) return;
      try {
        const saved = JSON.parse(
          localStorage.getItem(STORAGE_PREFIX + key) ?? '[]'
        );
        if (Array.isArray(saved)) {
          this.done.set(
            new Set(saved.filter((id): id is string => typeof id === 'string'))
          );
        }
      } catch {
        // ignore unreadable or blocked storage
      }
    });
  }

  isDone(id: string): boolean {
    return this.done().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.done());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.save(next);
  }

  protected reset(): void {
    this.save(new Set());
  }

  private save(done: ReadonlySet<string>): void {
    this.done.set(done);
    try {
      localStorage.setItem(
        STORAGE_PREFIX + this.checklist(),
        JSON.stringify([...done])
      );
    } catch {
      // ignore blocked storage
    }
  }
}
