import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { KOFI_URL } from '../../core/constants/links';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly kofiUrl = KOFI_URL;
  private readonly analytics = inject(AnalyticsService);

  protected onKofiClick(): void {
    this.analytics.track('kofi-click', { place: 'footer' });
  }
}
