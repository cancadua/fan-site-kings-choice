import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KOFI_URL } from '../../core/constants/links';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Privacy {
  protected readonly kofiUrl = KOFI_URL;

  constructor() {
    inject(SeoService).update({
      ...PAGE_SEO.privacy,
      breadcrumbs: [{ name: 'Privacy', path: PAGE_SEO.privacy.path }],
    });
  }
}
