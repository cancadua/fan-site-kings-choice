import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import { HomeCtaSectionComponent } from '../../shared/home-cta-section/home-cta-section.component';
import { HomeEventsHighlightComponent } from '../../shared/home-events-highlight/home-events-highlight.component';
import { HomeFeaturesComponent } from '../../shared/home-features/home-features.component';
import { HomeHeroComponent } from '../../shared/home-hero/home-hero.component';
import { HomeToolsSectionComponent } from '../../shared/home-tools-section/home-tools-section.component';
import { WhatsNewComponent } from '../../shared/whats-new/whats-new.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeHeroComponent,
    WhatsNewComponent,
    HomeEventsHighlightComponent,
    HomeFeaturesComponent,
    HomeToolsSectionComponent,
    HomeCtaSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor() {
    inject(SeoService).update(PAGE_SEO.home);
  }
}
