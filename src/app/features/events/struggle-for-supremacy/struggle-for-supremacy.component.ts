import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IntroPlayback } from '../../../core/intro/intro-playback.service';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { StruggleForSupremacyTabs } from './struggle-for-supremacy.schema';
import { WarriorSceneComponent } from '../../../shared/warrior-scene/warrior-scene.component';
import { EVENT_CONTENT } from '../../../shared/event-content';

@Component({
  selector: 'app-struggle-for-supremacy',
  standalone: true,
  imports: [AppTabsComponent, WarriorSceneComponent, ...EVENT_CONTENT],
  templateUrl: './struggle-for-supremacy.component.html',
  styleUrl: './struggle-for-supremacy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StruggleForSupremacyComponent extends TabbedPage {
  protected readonly intro = inject(IntroPlayback);

  constructor() {
    super(StruggleForSupremacyTabs);
  }
}
