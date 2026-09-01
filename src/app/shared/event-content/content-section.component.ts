import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A titled block within an event tab. Renders an optional heading and projects
 * its body. Consecutive sections are separated by a divider automatically.
 */
@Component({
  selector: 'app-content-section',
  standalone: true,
  template: `
    @if (heading()) {
      <h4 class="ec-section__title">{{ heading() }}</h4>
    }
    <ng-content />
  `,
  styleUrl: './content-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSectionComponent {
  readonly heading = input('');
}
