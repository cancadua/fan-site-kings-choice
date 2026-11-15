import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

/**
 * Small link button placed in a heading: copies a link straight to that
 * section (current page, tab and `#id`) and puts the `#id` in the address bar.
 */
@Component({
  selector: 'app-heading-anchor',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <button
      type="button"
      class="anchor"
      [class.anchor--copied]="copied()"
      [attr.aria-label]="'Copy link to “' + label() + '”'"
      (click)="copy()"
    >
      <app-icon [name]="copied() ? 'check' : 'link'" />
    </button>
    <span class="anchor__status" role="status">{{
      copied() ? 'Link copied' : ''
    }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      margin-left: 0.4rem;
    }
    .anchor {
      display: inline-grid;
      place-items: center;
      width: 26px;
      height: 26px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 6px;
      background: none;
      color: #d4af37;
      cursor: pointer;
      opacity: var(--anchor-opacity, 0);
      transition: opacity 0.2s ease;
    }
    .anchor app-icon {
      width: 15px;
      height: 15px;
    }
    .anchor:hover,
    .anchor:focus-visible,
    .anchor--copied {
      opacity: 1;
      border-color: rgba(212, 175, 55, 0.4);
    }
    .anchor:focus-visible {
      outline: 2px solid #ffc107;
      outline-offset: 1px;
    }
    .anchor__status {
      font-family: 'Lora', serif;
      font-size: 0.75rem;
      font-weight: 400;
      letter-spacing: 0;
      color: #d2cbb6;
      margin-left: 0.35rem;
    }
    @media (hover: none) {
      .anchor {
        opacity: 0.55;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingAnchorComponent {
  private readonly document = inject(DOCUMENT);

  /** Id of the element the link points at. */
  readonly anchorId = input.required<string>();
  /** Heading text, used for the button's accessible name. */
  readonly label = input.required<string>();

  protected readonly copied = signal(false);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    const location = this.document.location;
    const url = `${location.origin}${location.pathname}${location.search}#${this.anchorId()}`;
    this.document.defaultView?.history.replaceState(
      this.document.defaultView.history.state,
      '',
      url
    );
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard can be blocked; the address bar already holds the link.
    }
    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), 1800);
  }
}
