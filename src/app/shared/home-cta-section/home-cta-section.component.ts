import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { KOFI_URL } from '../../core/constants/links';
import { SiteSearch } from '../../core/search/site-search.service';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-home-cta-section',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './home-cta-section.component.html',
  styleUrls: ['./home-cta-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCtaSectionComponent {
  protected readonly search = inject(SiteSearch);
  private readonly analytics = inject(AnalyticsService);
  protected readonly kofiUrl = KOFI_URL;

  protected onKofiClick(): void {
    this.analytics.track('kofi-click', { place: 'home' });
  }
}
