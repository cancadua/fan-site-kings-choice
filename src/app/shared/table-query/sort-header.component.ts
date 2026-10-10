import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { TableQuery } from './table-query';

/** Header cell that sorts its table by `appSortHeader` (an API column) on click. */
@Component({
  // Attribute selector: tables only allow <tr>/<th> here, not a custom element.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'th[appSortHeader]',
  standalone: true,
  template: `
    <button
      type="button"
      class="sort-button"
      (click)="query().toggleSort(appSortHeader())"
    >
      <ng-content />
      <span class="sort-indicator" aria-hidden="true">{{ indicator() }}</span>
    </button>
  `,
  styles: `
    .sort-button {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      color: inherit;
      font: inherit;
    }

    .sort-button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .sort-indicator {
      min-width: 0.8em;
      opacity: 0.85;
    }
  `,
  host: { '[attr.aria-sort]': 'ariaSort()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortHeaderComponent {
  readonly appSortHeader = input.required<string>();
  readonly query = input.required<TableQuery>();

  private readonly direction = computed(() =>
    this.query().sortBy() === this.appSortHeader()
      ? this.query().sortDir()
      : null
  );

  readonly indicator = computed(() => {
    const dir = this.direction();
    return dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '↕';
  });

  readonly ariaSort = computed(() => {
    const dir = this.direction();
    return dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : null;
  });
}
