import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { GLOSSARY, GlossaryKey } from '../../core/constants/glossary';

let nextTermId = 0;

/**
 * A game term inside guide text. Tapping it opens a short definition in a
 * native popover (closes on Esc or a tap elsewhere). The popover is tied to the
 * word with CSS anchor positioning; older browsers get it placed by script.
 */
@Component({
  selector: 'app-term',
  standalone: true,
  template: `
    <button
      type="button"
      class="term"
      #trigger
      [attr.popovertarget]="popoverId"
      [attr.aria-describedby]="popoverId"
      [style.anchor-name]="anchorName"
    >
      <ng-content />
    </button>
    <span
      class="term__pop"
      popover
      #pop
      [id]="popoverId"
      role="tooltip"
      [style.position-anchor]="anchorName"
      (toggle)="onToggle($event)"
    >
      <strong class="term__title">{{ entry().term }}</strong>
      <span class="term__def">{{ entry().definition }}</span>
    </span>
  `,
  styleUrl: './content-term.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentTermComponent {
  readonly key = input.required<GlossaryKey>();
  protected readonly entry = computed(() => GLOSSARY[this.key()]);

  private readonly uid = nextTermId++;
  protected readonly popoverId = `term-${this.uid}`;
  protected readonly anchorName = `--term-${this.uid}`;

  private readonly trigger =
    viewChild.required<ElementRef<HTMLElement>>('trigger');
  private readonly pop = viewChild.required<ElementRef<HTMLElement>>('pop');

  /** Fallback placement for browsers without CSS anchor positioning. */
  protected onToggle(event: Event): void {
    if ((event as ToggleEvent).newState !== 'open') return;
    if (CSS.supports('position-area', 'top')) return;

    const pop = this.pop().nativeElement;
    const anchor = this.trigger().nativeElement.getBoundingClientRect();
    const box = pop.getBoundingClientRect();
    const margin = 12;
    const left = Math.min(
      Math.max(margin, anchor.left + anchor.width / 2 - box.width / 2),
      window.innerWidth - box.width - margin
    );
    const above = anchor.top - box.height - 8;
    const top = above >= margin ? above : anchor.bottom + 8;
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }
}
