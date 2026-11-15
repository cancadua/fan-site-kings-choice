import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

/** A body paragraph in the shared event-content voice. `lead` adds a drop cap. */
@Component({
  selector: 'app-content-text',
  standalone: true,
  template:
    '<p class="ec-text" [class.ec-text--lead]="lead()"><ng-content /></p>',
  styleUrl: './content-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentTextComponent {
  /** Opening paragraph of a guide: starts with an illuminated capital. */
  readonly lead = input(false, { transform: booleanAttribute });
}
