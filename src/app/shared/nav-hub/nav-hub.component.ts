import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavHubItem } from './nav-hub.schema';

@Component({
  selector: 'app-nav-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-hub.component.html',
  styleUrls: ['./nav-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubComponent<
  T extends string = string,
> implements AfterViewInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly navContainer =
    viewChild<ElementRef<HTMLElement>>('navContainer');

  title = input.required<string>();
  subtitle = input('');
  navLabel = input('Sections');
  /** `h1` makes the selected article title the page heading; the hub title then is plain text. */
  articleHeading = input<'h1' | 'h2'>('h2');
  items = input.required<NavHubItem<T>[]>();
  activeId = model.required<T>();
  /** Shows a search box above the list; hidden on narrow screens where the list scrolls sideways. */
  filterable = input(false);

  protected readonly query = signal('');
  protected readonly visibleItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((item) =>
      `${item.title} ${item.subtitle ?? ''}`.toLowerCase().includes(q)
    );
  });

  ngAfterViewInit(): void {
    this.scrollToActiveButton();
  }

  get activeItem(): NavHubItem<T> | undefined {
    return this.items().find((item) => item.id === this.activeId());
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  selectItem(id: T): void {
    this.activeId.set(id);
    setTimeout(() => this.scrollToActiveButton(), 0);
  }

  private scrollToActiveButton(): void {
    if (!this.isBrowser) return;
    const nav = this.navContainer()?.nativeElement;
    if (!nav) return;

    const activeButton = nav.querySelector(
      '.nav-hub-link.active'
    ) as HTMLElement;
    if (!activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const scrollAmount =
      buttonRect.left - navRect.left - navRect.width / 2 + buttonRect.width / 2;

    nav.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
