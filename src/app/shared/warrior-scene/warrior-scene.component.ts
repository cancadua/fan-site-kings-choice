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

@Component({
  selector: 'app-warrior-scene',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './warrior-scene.component.html',
  styleUrl: './warrior-scene.component.scss',
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
export class WarriorSceneComponent {
  readonly title = input.required<string>();

  readonly backgroundSrc = input.required<string>();
  readonly backgroundWidth = input.required<number>();
  readonly backgroundHeight = input.required<number>();

  readonly leftSrc = input.required<string>();
  readonly leftWidth = input.required<number>();
  readonly leftHeight = input.required<number>();

  readonly rightSrc = input.required<string>();
  readonly rightWidth = input.required<number>();
  readonly rightHeight = input.required<number>();

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

      this.runAfter(50, () => this.animating.set(true));
      this.runAfter(this.holdMs(), () => this.beginFadeOut());

      this.destroyRef.onDestroy(() => {
        this.pendingTimers.forEach(timer => clearTimeout(timer));
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
    this.runAfter(durationMs, () => this.done.set(true));
  }

  private runAfter(delayMs: number, fn: () => void): void {
    const timer = setTimeout(() => {
      this.pendingTimers.delete(timer);
      fn();
    }, delayMs);
    this.pendingTimers.add(timer);
  }
}
