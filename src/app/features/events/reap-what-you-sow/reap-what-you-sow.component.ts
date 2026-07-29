import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { ContentTab } from '../../../shared/app-tabs/app-tabs.schema';
import { ReapWhatYouSowTabs } from './reap-what-you-sow.schema';

@Component({
  selector: 'app-reap-what-you-sow',
  standalone: true,
  imports: [AppTabsComponent],
  templateUrl: './reap-what-you-sow.component.html',
  styleUrl: './reap-what-you-sow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReapWhatYouSowComponent {
  protected readonly reapWhatYouSowTabs = ReapWhatYouSowTabs;

  activeTab: ContentTab = ReapWhatYouSowTabs[0];
}
