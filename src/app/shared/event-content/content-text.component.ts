import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A body paragraph in the shared event-content voice. */
@Component({
  selector: 'app-content-text',
  standalone: true,
  template: '<p class="ec-text"><ng-content /></p>',
  styleUrl: './content-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentTextComponent {}
