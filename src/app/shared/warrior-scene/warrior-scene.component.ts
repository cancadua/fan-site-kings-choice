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
    '[class.done]': 'done()',
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

  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  protected readonly animating = signal(false);
  protected readonly fadingOut = signal(false);
  protected readonly done = signal(false);

  constructor() {
    afterNextRender(() => {
      // Backdrop-filter/filter/transform on an ancestor (e.g. nav-hub-content)
      // creates a new containing block, which breaks `position: fixed`.
      // Re-parent to <body> so the scene always covers the full viewport.
      this.renderer.appendChild(this.document.body, this.host.nativeElement);

      const openTimer = setTimeout(() => this.animating.set(true), 50);
      const fadeTimer = setTimeout(() => this.fadingOut.set(true), this.holdMs());
      const doneTimer = setTimeout(
        () => this.done.set(true),
        this.holdMs() + this.fadeOutMs(),
      );

      this.destroyRef.onDestroy(() => {
        clearTimeout(openTimer);
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
        this.host.nativeElement.remove();
      });
    });
  }
}
