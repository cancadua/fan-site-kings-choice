import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

/** A framed tip or caveat that sits beside the main text. */
@Component({
  selector: 'app-content-note',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="ec-note" role="note">
      <app-icon class="ec-note__icon" name="scroll" />
      <p class="ec-note__text"><ng-content /></p>
    </div>
  `,
  styleUrl: './content-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentNoteComponent {}
