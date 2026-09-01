import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A muted, italic aside — tips and caveats that sit beside the main text. */
@Component({
  selector: 'app-content-note',
  standalone: true,
  template: '<p class="ec-note"><ng-content /></p>',
  styleUrl: './content-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentNoteComponent {}
