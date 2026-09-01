import { ContentSectionComponent } from './content-section.component';
import { ContentStepsComponent, ContentStepComponent } from './content-steps.component';
import { ContentTextComponent } from './content-text.component';
import { ContentNoteComponent } from './content-note.component';
import { ContentListComponent } from './content-list.component';

export { ContentSectionComponent } from './content-section.component';
export { ContentStepsComponent, ContentStepComponent } from './content-steps.component';
export { ContentTextComponent } from './content-text.component';
export { ContentNoteComponent } from './content-note.component';
export { ContentListComponent } from './content-list.component';

/** Spread into a standalone component's `imports` to use the whole vocabulary. */
export const EVENT_CONTENT = [
  ContentSectionComponent,
  ContentStepsComponent,
  ContentStepComponent,
  ContentTextComponent,
  ContentNoteComponent,
  ContentListComponent,
] as const;
