import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { SearchEntry, SearchGroup, search } from './search-index';

interface ResultGroup {
  name: SearchGroup;
  items: { entry: SearchEntry; index: number }[];
}

/**
 * Site-wide search (Ctrl+K / ⌘K / "/"). A modal <dialog> with a combobox:
 * type to filter, ↑/↓ to move, Enter to open, Esc to close.
 * Loaded on first use, so it adds nothing to the first page load.
 */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);

  readonly open = model.required<boolean>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input =
    viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  private readonly results = computed(() => search(this.query()));

  /** Results grouped for display, keeping one running index for the keyboard. */
  protected readonly groups = computed<ResultGroup[]>(() => {
    const groups: ResultGroup[] = [];
    let index = 0;
    for (const entry of this.results()) {
      let group = groups.find((g) => g.name === entry.group);
      if (!group) {
        group = { name: entry.group, items: [] };
        groups.push(group);
      }
      group.items.push({ entry, index: 0 });
    }
    for (const group of groups) {
      for (const item of group.items) item.index = index++;
    }
    return groups;
  });

  private readonly flat = computed(() =>
    this.groups().flatMap((group) => group.items.map((item) => item.entry))
  );

  protected readonly activeOptionId = computed(() =>
    this.flat().length ? `palette-opt-${this.activeIndex()}` : null
  );

  constructor() {
    // A click on the <dialog> itself is a click on the backdrop. (Newer
    // browsers also handle this through `closedby="any"`.)
    afterNextRender(() => {
      const dialog = this.dialog().nativeElement;
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) this.open.set(false);
      });
    });

    // Opens and closes the native dialog to match `open`.
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        this.query.set('');
        this.activeIndex.set(0);
        dialog.showModal();
        this.input().nativeElement.focus();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });

    // Keeps the highlighted result visible while moving with the keyboard.
    afterRenderEffect(() => {
      const id = this.activeOptionId();
      if (!id) return;
      this.list()
        .nativeElement.querySelector(`#${id}`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.flat().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.activeIndex.update((i) => (i + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.activeIndex.update((i) => (i - 1 + count) % count);
    } else if (event.key === 'Enter') {
      const entry = this.flat()[this.activeIndex()];
      if (entry) {
        event.preventDefault();
        this.go(entry);
      }
    }
  }

  protected go(entry: SearchEntry): void {
    this.analytics.track('search-select', { group: entry.group });
    this.open.set(false);
    this.router.navigateByUrl(entry.url);
  }

  protected onClosed(): void {
    this.open.set(false);
  }
}
