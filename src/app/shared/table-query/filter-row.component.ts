import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  FilterOption,
  TableColumn,
  TableQuery,
  columnOptions,
} from './table-query';

/**
 * Row of per-column filters under a table header, one cell per entry of
 * `query.columns` (so they must follow the table's column order).
 */
@Component({
  // Attribute selector: tables only allow <tr>/<th> here, not a custom element.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tr[appFilterRow]',
  standalone: true,
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
  host: { class: 'filter-row' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterRowComponent {
  readonly query = input.required<TableQuery>({ alias: 'appFilterRow' });

  text(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  options(col: TableColumn): readonly FilterOption[] {
    return columnOptions(col);
  }

  selected(col: TableColumn): string[] {
    return this.query().value(col.key).split(',').filter(Boolean);
  }

  toggleOption(col: TableColumn, value: string): void {
    const selected = this.selected(col);
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    this.query().set(col.key, next.join(','), true);
  }

  enumSummary(col: TableColumn): string {
    const selected = this.selected(col);
    if (selected.length === 0) return 'Any';
    if (selected.length > 1) return `${selected.length} selected`;
    return (
      this.options(col).find((o) => o.value === selected[0])?.label ??
      selected[0]
    );
  }
}
