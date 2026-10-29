import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

let nextId = 0;

/**
 * Modal dialog built on the native <dialog> element (focus trap, Escape and
 * backdrop come from the browser). Project the body content; it is styled by
 * the parent component.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalComponent {
  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open = input(false);
  title = input.required<string>();
  /** Emitted whenever the dialog closes (Escape, close button or `open` set to false). */
  closed = output<void>();

  readonly titleId = `app-modal-title-${nextId++}`;

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      else if (!this.open() && dialog.open) dialog.close();
    });
  }

  close(): void {
    this.dialog().nativeElement.close();
  }
}
