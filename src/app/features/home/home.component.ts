import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import { HomeEventsHighlightComponent } from '../../shared/home-events-highlight/home-events-highlight.component';
import { HomeToolsSectionComponent } from '../../shared/home-tools-section/home-tools-section.component';
import { WhatsNewComponent } from '../../shared/whats-new/whats-new.component';
import { HomeCtaSectionComponent } from '../../shared/home-cta-section/home-cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    WhatsNewComponent,
    HomeEventsHighlightComponent,
    HomeToolsSectionComponent,
    HomeCtaSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor() {
    inject(SeoService).update(PAGE_SEO.home);
  }

  /** Indices for the floating sparks in the hero; their look is set in SCSS. */
  protected readonly sparks = Array.from({ length: 16 }, (_, i) => i + 1);
}
