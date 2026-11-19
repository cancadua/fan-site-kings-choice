import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { KeyFactsComponent } from '../key-facts/key-facts.component';
import { NavHubArticleHeaderComponent } from './nav-hub-article-header.component';
import { NavHubSheetComponent } from './nav-hub-sheet.component';
import { NavHubTocComponent } from './nav-hub-toc.component';
import { NavHubItem } from './nav-hub.schema';

@Component({
  selector: 'app-nav-hub',
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    KeyFactsComponent,
    NavHubArticleHeaderComponent,
    NavHubSheetComponent,
    NavHubTocComponent,
  ],
  templateUrl: './nav-hub.component.html',
  styleUrls: ['./nav-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubComponent<T extends string = string> {
  title = input.required<string>();
  subtitle = input('');
  navLabel = input('Sections');
  /** `h1` makes the selected article title the page heading; the hub title then is plain text. */
  articleHeading = input<'h1' | 'h2'>('h2');
  items = input.required<NavHubItem<T>[]>();
  activeId = model.required<T>();
  /** URL of each item. The sidebar is made of real links, so crawlers can find every page. */
  itemHref = input.required<(id: T) => string>();
  /** Shows a search box above the sidebar list (the phone sheet lists everything). */
  filterable = input(false);
  /** Shows each item's subtitle under its title in the sidebar and the phone sheet. */
  showItemSubtitles = input(false);

  protected readonly query = signal('');
  protected readonly visibleItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((item) =>
      `${item.title} ${item.subtitle ?? ''}`.toLowerCase().includes(q)
    );
  });

  get activeItem(): NavHubItem<T> | undefined {
    return this.items().find((item) => item.id === this.activeId());
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** A plain click switches in place; Ctrl/Cmd/Shift/Alt-click opens the link as usual. */
  protected onItemClick(event: MouseEvent, id: T): void {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    this.selectItem(id);
  }

  selectItem(id: T): void {
    this.activeId.set(id);
  }
}
