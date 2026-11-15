import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { NavHubItem } from './nav-hub.schema';

/**
 * Title plaque above a nav-hub article: the item's artwork (or a faint emblem
 * watermark when it has none), a round emblem, the title and the subtitle.
 */
@Component({
  selector: 'app-nav-hub-article-header',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    @let active = item();
    <header class="plaque" [class.plaque--banner]="!!active.banner">
      @if (active.banner; as banner) {
        <img
          class="plaque__banner"
          [src]="banner.src"
          [width]="banner.width"
          [height]="banner.height"
          alt=""
          decoding="async"
        />
      } @else if (active.icon) {
        <app-icon class="plaque__watermark" [name]="active.icon" />
      }
      @if (reviewedLabel(); as reviewed) {
        <p class="plaque__reviewed">
          <app-icon name="badgeCheck" />
          Reviewed
          <time [attr.datetime]="active.reviewed">{{ reviewed }}</time>
        </p>
      }
      <div class="plaque__heading">
        @if (active.icon) {
          <span class="plaque__emblem">
            <app-icon [name]="active.icon" />
          </span>
        }
        <div>
          @if (headingLevel() === 'h1') {
            <h1 class="plaque__title">{{ active.title }}</h1>
          } @else {
            <h2 class="plaque__title">{{ active.title }}</h2>
          }
          @if (active.subtitle) {
            <p class="plaque__subtitle">{{ active.subtitle }}</p>
          }
          @if (active.tags?.length) {
            <ul class="plaque__tags" aria-label="Variants">
              @for (tag of active.tags; track tag) {
                <li>{{ tag }}</li>
              }
            </ul>
          }
        </div>
      </div>
    </header>
  `,
  styleUrl: './nav-hub-article-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubArticleHeaderComponent {
  readonly item = input.required<NavHubItem>();
  readonly headingLevel = input<'h1' | 'h2'>('h2');

  /** "Oct 2026"; fixed locale and UTC so prerendered and live pages match. */
  protected readonly reviewedLabel = computed(() => {
    const iso = this.item().reviewed;
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  });
}
