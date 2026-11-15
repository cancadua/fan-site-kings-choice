import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Centred home-page section title with the ornate gold divider and a tagline. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  template: `
    <p class="eyebrow">{{ eyebrow() }}</p>
    <h2 class="title">{{ heading() }}</h2>
    @if (subtitle()) {
      <p class="subtitle">{{ subtitle() }}</p>
    }
  `,
  styleUrl: './section-heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly heading = input.required<string>();
  readonly eyebrow = input('');
  readonly subtitle = input('');
}
