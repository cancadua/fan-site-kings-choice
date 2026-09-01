import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  afterNextRender,
  DestroyRef,
  ElementRef,
  Renderer2,
  inject,
} from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';

/**
 * Mirrors the `.magic-book-scene` background exactly (token lives in styles.scss).
 * Applied to <body> only while the intro is on screen, so the fade-out reveals
 * no colour seam behind the book.
 */
const SCENE_BACKGROUND_COLOR = '#07050e';
const SCENE_BACKGROUND_IMAGE = 'var(--magic-book-scene-bg)';

@Component({
  selector: 'app-magic-book-scene',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './magic-book-scene.component.html',
  styleUrl: './magic-book-scene.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.animate]': 'animating()',
    '[class.fade-out]': 'fadingOut()',
    '[class.skipped]': 'skipped()',
    '[class.done]': 'done()',
    '[attr.role]': '"button"',
    '[attr.tabindex]': '0',
    '[attr.aria-label]': '"Skip intro animation"',
    '(click)': 'skip()',
    '(keydown.enter)': 'skip()',
    '(keydown.space)': 'skip($event)',
    '(keydown.escape)': 'skip()',
  },
})
export class MagicBookSceneComponent {
  readonly title = input.required<string>();

  readonly bookSrc = input('assets/img/school-of-athens/magic-book.png');
  readonly bookWidth = input(800);
  readonly bookHeight = input(400);

  /** Delay before the fade-out begins, in milliseconds. */
  readonly holdMs = input(3400);
  /** Duration of the fade-out transition, in milliseconds (must match the SCSS transition). */
  readonly fadeOutMs = input(1400);
  /** Duration of the (much snappier) fade-out when the viewer skips, in milliseconds. */
  readonly skipFadeOutMs = input(300);

  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  protected readonly animating = signal(false);
  protected readonly fadingOut = signal(false);
  protected readonly skipped = signal(false);
  protected readonly done = signal(false);
  protected readonly showSkipHint = signal(true);

  private readonly pendingTimers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    afterNextRender(() => {
      // Backdrop-filter/filter/transform on an ancestor (e.g. nav-hub-content)
      // creates a new containing block, which breaks `position: fixed`.
      // Re-parent to <body> so the scene always covers the full viewport.
      this.renderer.appendChild(this.document.body, this.host.nativeElement);
      // `fixed` anchors the gradient to the viewport, not the (tall, scrollable)
      // <body> box — otherwise its centre drifts and the book edge shows a seam.
      this.renderer.setStyle(this.document.body, 'background-color', SCENE_BACKGROUND_COLOR);
      this.renderer.setStyle(this.document.body, 'background-image', SCENE_BACKGROUND_IMAGE);
      this.renderer.setStyle(this.document.body, 'background-attachment', 'fixed');

      this.runAfter(50, () => this.animating.set(true));
      this.runAfter(this.holdMs(), () => this.beginFadeOut());

      this.destroyRef.onDestroy(() => {
        this.pendingTimers.forEach(timer => clearTimeout(timer));
        this.restoreBodyBackground();
        this.host.nativeElement.remove();
      });
    });
  }

  /** Lets a viewer skip straight to the fade-out instead of waiting out the hold. */
  protected skip(event?: Event): void {
    event?.preventDefault();
    if (this.fadingOut()) return;
    this.pendingTimers.forEach(timer => clearTimeout(timer));
    this.pendingTimers.clear();
    this.animating.set(true);
    this.skipped.set(true);
    this.beginFadeOut(this.skipFadeOutMs());
  }

  private beginFadeOut(durationMs = this.fadeOutMs()): void {
    this.fadingOut.set(true);
    this.runAfter(durationMs, () => {
      this.done.set(true);
      this.restoreBodyBackground();
    });
  }

  /** Hands <body> back to its stylesheet background once the intro is gone. */
  private restoreBodyBackground(): void {
    this.renderer.removeStyle(this.document.body, 'background-color');
    this.renderer.removeStyle(this.document.body, 'background-image');
    this.renderer.removeStyle(this.document.body, 'background-attachment');
  }

  private runAfter(delayMs: number, fn: () => void): void {
    const timer = setTimeout(() => {
      this.pendingTimers.delete(timer);
      fn();
    }, delayMs);
    this.pendingTimers.add(timer);
  }
}
