import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PAGE_SEO } from '../../core/seo/seo.constants';
import { SeoService } from '../../core/seo/seo.service';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';
import { KNIGHT_SECTIONS, Section } from './knight-development.data';

const DESCRIPTION_MAX = 155;

/** First sentence-sized chunk of a section, used as its meta description. */
function describe(section: Section): string {
  const text = section.content[0]?.text[0] ?? '';
  if (!text) return PAGE_SEO.knights.description;
  return text.length <= DESCRIPTION_MAX
    ? text
    : `${text.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`;
}

@Component({
  selector: 'app-knight-development',
  templateUrl: './knight-development.component.html',
  styleUrls: ['./knight-development.component.scss'],
  standalone: true,
  imports: [CommonModule, NavHubComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnightDevelopmentComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly sections = KNIGHT_SECTIONS;

  private readonly requested = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('section'))),
    { initialValue: this.route.snapshot.paramMap.get('section') }
  );

  readonly activeSection = computed(() => {
    const requested = this.requested();
    return this.sections.some((s) => s.id === requested)
      ? (requested as string)
      : this.sections[0].id;
  });

  readonly activeData = computed<Section | undefined>(() =>
    this.sections.find((s) => s.id === this.activeSection())
  );

  constructor() {
    effect(() => {
      const section = this.activeData();
      if (!section) return;
      const path = `/knight-development/${section.id}`;
      const isFirst = section.id === this.sections[0].id;
      this.seo.update({
        title: isFirst
          ? PAGE_SEO.knights.title
          : `${section.title} – King's Choice Knight Guide`,
        description: isFirst ? PAGE_SEO.knights.description : describe(section),
        path,
        breadcrumbs: [
          {
            name: 'Knight Development',
            path: `/knight-development/${this.sections[0].id}`,
          },
          ...(isFirst ? [] : [{ name: section.title, path }]),
        ],
      });
    });
  }

  onSectionChange(id: string): void {
    this.router.navigate(['/knight-development', id], { replaceUrl: true });
  }
}
