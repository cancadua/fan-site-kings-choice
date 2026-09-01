import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A bulleted list with the shared sword marker. */
@Component({
  selector: 'app-content-list',
  standalone: true,
  template: `
    <ul class="ec-list">
      @for (item of items(); track $index) {
        <li>{{ item }}</li>
      }
    </ul>
  `,
  styleUrl: './content-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentListComponent {
  readonly items = input<string[]>([]);
}
