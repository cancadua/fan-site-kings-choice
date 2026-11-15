import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { slugify } from '../utils/slug';
import { HeadingAnchorComponent } from './heading-anchor.component';

/**
 * A titled block within an event tab. Renders an optional heading and projects
 * its body. Consecutive sections are separated by a divider automatically.
 * A titled section gets an id from its heading, so it can be linked to and
 * listed in the "On this page" contents.
 */
@Component({
  selector: 'app-content-section',
  standalone: true,
  imports: [HeadingAnchorComponent],
  host: {
    class: 'reveal-on-scroll',
    '[attr.id]': 'heading() ? sectionId() : null',
    '[attr.data-toc]': 'heading() || null',
  },
  template: `
    @if (heading()) {
      <h4 class="ec-section__title">
        {{ heading() }}
        <app-heading-anchor [anchorId]="sectionId()" [label]="heading()" />
      </h4>
    }
    <ng-content />
  `,
  styleUrl: './content-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSectionComponent {
  readonly heading = input('');
  protected readonly sectionId = computed(() => slugify(this.heading()));
}
