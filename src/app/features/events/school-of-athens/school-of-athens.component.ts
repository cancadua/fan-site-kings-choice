import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { SchoolOfAthensTabs } from './school-of-athens.schema';
import { EVENT_CONTENT } from '../../../shared/event-content';
import { MagicBookSceneComponent } from '../../../shared/magic-book-scene/magic-book-scene.component';

@Component({
  selector: 'app-school-of-athens',
  standalone: true,
  imports: [AppTabsComponent, MagicBookSceneComponent, ...EVENT_CONTENT],
  templateUrl: './school-of-athens.component.html',
  styleUrl: './school-of-athens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolOfAthensComponent extends TabbedPage {
  constructor() {
    super(SchoolOfAthensTabs);
  }
}
