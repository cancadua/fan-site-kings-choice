import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Ordered container for <app-content-step> items. Drives automatic step
 * numbering via a CSS counter, so steps stay numbered correctly when reordered.
 */
@Component({
  selector: 'app-content-steps',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './content-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStepsComponent {}

/**
 * A single numbered step. Leave `marker` unset to use the automatic number from
 * the parent <app-content-steps>, or pass a custom glyph (e.g. a roman numeral).
 */
@Component({
  selector: 'app-content-step',
  standalone: true,
  template: `
    <div class="ec-step__header">
      <span class="ec-step__marker">{{ marker() }}</span>
      <h4 class="ec-step__title">{{ heading() }}</h4>
    </div>
    <ng-content />
  `,
  styleUrl: './content-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStepComponent {
  readonly heading = input('');
  readonly marker = input('');
}
