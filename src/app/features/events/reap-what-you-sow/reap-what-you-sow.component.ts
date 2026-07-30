import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppTabsComponent } from '../../../shared/app-tabs/app-tabs.component';
import { TabbedPage } from '../../../shared/app-tabs/tabbed-page';
import { ReapWhatYouSowTabs } from './reap-what-you-sow.schema';

@Component({
  selector: 'app-reap-what-you-sow',
  standalone: true,
  imports: [AppTabsComponent],
  templateUrl: './reap-what-you-sow.component.html',
  styleUrl: './reap-what-you-sow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReapWhatYouSowComponent extends TabbedPage {
  constructor() {
    super(ReapWhatYouSowTabs);
  }
}
