import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

interface TocEntry {
  id: string;
  label: string;
}

/**
 * "On this page" contents for a nav-hub article. It lists every element in
 * `root` marked with `data-toc` (sections and steps give themselves one),
 * highlights the one being read, and follows tab switches automatically.
 * It also scrolls to the `#section` of a shared link once the content is there.
 */
@Component({
  selector: 'app-nav-hub-toc',
  standalone: true,
  template: `
    @if (entries().length > 1) {
      <nav class="toc" aria-label="On this page">
        <p class="toc__title">On this page</p>
        <ol class="toc__list">
          @for (entry of entries(); track entry.id) {
            <li>
              <a
                class="toc__link"
                [class.toc__link--active]="entry.id === activeId()"
                [attr.aria-current]="
                  entry.id === activeId() ? 'location' : null
                "
                [href]="'#' + entry.id"
                (click)="goTo($event, entry.id)"
                >{{ entry.label }}</a
              >
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styleUrl: './nav-hub-toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubTocComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  /** Element whose `[data-toc]` descendants are listed. */
  readonly root = input.required<HTMLElement>();

  readonly entries = signal<TocEntry[]>([]);
  protected readonly activeId = signal<string | null>(null);

  private observer: IntersectionObserver | undefined;
  private pendingFragment: string | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const root = this.root();
      let frame = 0;
      const rescan = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => this.scan(root));
      };
      // Tabs and events swap the content in place, so watch for changes.
      const mutations = new MutationObserver(rescan);
      mutations.observe(root, { childList: true, subtree: true });

      this.pendingFragment = this.readFragment();
      this.scan(root);

      const navigation = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.pendingFragment = this.readFragment();
          rescan();
        });

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        mutations.disconnect();
        navigation.unsubscribe();
        this.observer?.disconnect();
      });
    });
  }

  protected goTo(event: MouseEvent, id: string): void {
    event.preventDefault();
    const target = this.document.getElementById(id);
    if (!target) return;
    this.scrollTo(target);
    const view = this.document.defaultView;
    view?.history.replaceState(view.history.state, '', `#${id}`);
    this.activeId.set(id);
  }

  private scan(root: HTMLElement): void {
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-toc][id]')
    );
    const entries = targets.map((el) => ({
      id: el.id,
      label: el.dataset['toc'] ?? '',
    }));
    const current = this.entries();
    const changed =
      entries.length !== current.length ||
      entries.some((entry, i) => entry.id !== current[i].id);
    if (changed) {
      this.entries.set(entries);
      this.watch(targets);
    }

    if (this.pendingFragment) {
      const target = this.document.getElementById(this.pendingFragment);
      if (target && root.contains(target)) {
        this.pendingFragment = null;
        this.scrollTo(target);
      }
    }
  }

  /** The active entry is the last heading that has passed the upper part of the screen. */
  private watch(targets: HTMLElement[]): void {
    this.observer?.disconnect();
    if (!targets.length) {
      this.activeId.set(null);
      return;
    }
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) visible.add(record.target.id);
          else visible.delete(record.target.id);
        }
        const first = targets.find((el) => visible.has(el.id));
        if (first) this.activeId.set(first.id);
      },
      { rootMargin: '-10% 0px -60% 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    this.observer = observer;
    this.activeId.set(targets[0].id);
  }

  private scrollTo(target: HTMLElement): void {
    const reduceMotion = this.document.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  private readFragment(): string | null {
    const hash = this.document.location.hash.slice(1);
    return hash ? decodeURIComponent(hash) : null;
  }
}
