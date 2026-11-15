import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { NavHubItem } from './nav-hub.schema';

/**
 * Phone-sized picker for a nav-hub: a sticky bar showing the current item that
 * opens a bottom sheet with the full list. Built on a modal <dialog>, so focus
 * is trapped while open and Esc, the back gesture or a tap outside close it.
 */
@Component({
  selector: 'app-nav-hub-sheet',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    @let current = active();
    <button
      type="button"
      class="trigger"
      aria-haspopup="dialog"
      (click)="open()"
    >
      @if (current?.icon; as icon) {
        <app-icon class="trigger__icon" [name]="icon" />
      }
      <span class="trigger__text">
        <span class="trigger__label">{{ label() }}</span>
        <span class="trigger__title">{{ current?.title }}</span>
      </span>
      <span class="trigger__change">
        Change <app-icon name="chevronDown" />
      </span>
    </button>

    <dialog
      class="sheet lock-scroll"
      #dialog
      [attr.aria-label]="label()"
      closedby="any"
    >
      <div class="sheet__panel">
        <div class="sheet__handle" aria-hidden="true"></div>
        <div class="sheet__header">
          <h2 class="sheet__title">{{ label() }}</h2>
          <button
            type="button"
            class="sheet__close"
            aria-label="Close"
            (click)="close()"
          >
            <app-icon name="close" />
          </button>
        </div>
        <ul class="sheet__list">
          @for (item of items(); track item.id) {
            <li>
              <button
                type="button"
                class="sheet__item"
                [class.sheet__item--active]="item.id === activeId()"
                [attr.aria-current]="item.id === activeId() ? 'page' : null"
                (click)="pick(item.id)"
              >
                @if (item.icon; as icon) {
                  <app-icon class="sheet__item-icon" [name]="icon" />
                }
                <span class="sheet__item-text">
                  <span class="sheet__item-title">{{ item.title }}</span>
                  @if (showSubtitles() && item.subtitle) {
                    <span class="sheet__item-subtitle">{{
                      item.subtitle
                    }}</span>
                  }
                </span>
                @if (item.id === activeId()) {
                  <app-icon class="sheet__item-check" name="check" />
                }
              </button>
            </li>
          }
        </ul>
      </div>
    </dialog>
  `,
  styleUrl: './nav-hub-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubSheetComponent<T extends string = string> {
  readonly items = input.required<NavHubItem<T>[]>();
  readonly activeId = input.required<T>();
  readonly label = input('Sections');
  readonly showSubtitles = input(false);
  readonly choose = output<T>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly active = computed(() =>
    this.items().find((item) => item.id === this.activeId())
  );

  constructor() {
    // A tap that lands on the <dialog> itself is a tap on the dimmed backdrop.
    afterNextRender(() => {
      const dialog = this.dialog().nativeElement;
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  protected open(): void {
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected pick(id: T): void {
    this.close();
    if (id !== this.activeId()) this.choose.emit(id);
  }
}
