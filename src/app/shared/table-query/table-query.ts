import { computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ListParams } from '../../core/api/api.models';

/**
 * How a column is filtered:
 * - `text`: contains (case-insensitive)
 * - `enum`: one or more of `options`
 * - `select`: exactly one of `options` (e.g. an id)
 * - `number` / `date`: inclusive Min/Max range
 * - `bool`: yes / no
 * - `presence`: has a value / has none (`notnull` / `null`)
 * - `none`: not filterable (e.g. an actions column)
 */
export type ColumnType =
  'text' | 'enum' | 'select' | 'number' | 'date' | 'bool' | 'presence' | 'none';

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableColumn {
  /** Field of the row the column shows (the JSON field name). */
  key: string;
  type: ColumnType;
  /** Used for the filter's accessible name. */
  label?: string;
  /** Choices for `enum` / `select`; a function when they load later. */
  options?: readonly FilterOption[] | (() => readonly FilterOption[]);
  /** Labels for `presence` filters, e.g. Linked / Not linked. */
  presentLabel?: string;
  absentLabel?: string;
}

export type SortDir = 'asc' | 'desc';

const DEBOUNCE_MS = 300;

function sameParams(a: ListParams, b: ListParams): boolean {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k])
  );
}

function paramNames(column: TableColumn): string[] {
  switch (column.type) {
    case 'none':
      return [];
    case 'number':
    case 'date':
      return [`${column.key}Min`, `${column.key}Max`];
    default:
      return [column.key];
  }
}

/** Local calendar day (yyyy-MM-dd) of an ISO date, as the date filters use. */
function localDay(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function inRange(value: unknown, min: unknown, max: unknown): boolean {
  if (isEmpty(min) && isEmpty(max)) return true;
  if (isEmpty(value)) return false;
  return (
    (isEmpty(min) || (value as number | string) >= (min as number | string)) &&
    (isEmpty(max) || (value as number | string) <= (max as number | string))
  );
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

/**
 * Sorting and filtering state of one table, kept in the URL query string so it
 * survives a refresh and can be shared. The rows are fetched once and `apply`
 * sorts and filters them in the browser, so changing the query costs no request.
 * Create it in a component field initializer (it needs the injection context).
 * `prefix` keeps the params of several tables on one page apart.
 */
export class TableQuery {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly url = toSignal(this.route.queryParamMap);
  private readonly names: string[];
  private readonly drafts = signal<ListParams>({});
  private timer: ReturnType<typeof setTimeout> | undefined;

  /** Query params (without the prefix); the same object while they do not change. */
  readonly params = computed<ListParams>(
    () => {
      const url = this.url();
      const params: Record<string, string> = {};
      for (const name of this.names) {
        const value = url?.get(this.prefix + name);
        if (value) params[name] = value;
      }
      return params;
    },
    { equal: sameParams }
  );

  readonly sortBy = computed(() => this.params()['sortBy'] ?? null);
  readonly sortDir = computed<SortDir>(() =>
    this.params()['sortDir'] === 'desc' ? 'desc' : 'asc'
  );
  readonly hasFilters = computed(() =>
    Object.keys(this.params()).some((k) => k !== 'sortBy' && k !== 'sortDir')
  );

  constructor(
    readonly columns: readonly TableColumn[],
    private readonly prefix = ''
  ) {
    this.names = ['sortBy', 'sortDir', ...columns.flatMap(paramNames)];
  }

  /**
   * Filters and sorts rows by the current query. Reads `params`, so inside a
   * `computed` the result follows the URL. Without a sort the rows keep the
   * order they came in.
   */
  apply<T extends object>(rows: readonly T[]): T[] {
    const params = this.params();
    const field = (row: T, key: string): unknown =>
      (row as Record<string, unknown>)[key];

    const filtered = rows.filter((row) =>
      this.columns.every((col) =>
        this.matches(col, field(row, col.key), params)
      )
    );

    const sortBy = params['sortBy'];
    const column = this.columns.find((c) => c.key === sortBy);
    if (!column) return filtered;
    const sign = params['sortDir'] === 'desc' ? -1 : 1;
    const rank = this.sortRank(column);
    return filtered
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const x = rank(field(a.row, column.key));
        const y = rank(field(b.row, column.key));
        // Empty values go last in either direction.
        if (isEmpty(x) || isEmpty(y))
          return isEmpty(x) === isEmpty(y)
            ? a.index - b.index
            : isEmpty(x)
              ? 1
              : -1;
        const order =
          typeof x === 'string' && typeof y === 'string'
            ? collator.compare(x, y)
            : Number(x) - Number(y);
        return order * sign || a.index - b.index;
      })
      .map(({ row }) => row);
  }

  /** Cycles the column through ascending, descending and the original order. */
  toggleSort(key: string): void {
    if (this.sortBy() !== key) {
      this.navigate({ sortBy: key, sortDir: 'asc' });
    } else if (this.sortDir() === 'asc') {
      this.navigate({ sortBy: key, sortDir: 'desc' });
    } else {
      this.navigate({ sortBy: null, sortDir: null });
    }
  }

  /** Current value of a filter param, including what is still being typed. */
  value(name: string): string {
    return this.drafts()[name] ?? this.params()[name] ?? '';
  }

  /** Sets a filter param; typing is debounced before it reaches the URL. */
  set(name: string, value: string, immediate = false): void {
    this.drafts.update((drafts) => ({ ...drafts, [name]: value.trim() }));
    clearTimeout(this.timer);
    if (immediate) this.flush();
    else this.timer = setTimeout(() => this.flush(), DEBOUNCE_MS);
  }

  clearFilters(): void {
    clearTimeout(this.timer);
    this.drafts.set({});
    const cleared: Record<string, null> = {};
    for (const name of this.names)
      if (name !== 'sortBy' && name !== 'sortDir') cleared[name] = null;
    this.navigate(cleared);
  }

  private matches(
    col: TableColumn,
    value: unknown,
    params: ListParams
  ): boolean {
    const filter = params[col.key];
    switch (col.type) {
      case 'none':
        return true;
      case 'number':
        return inRange(
          isEmpty(value) ? null : Number(value),
          isEmpty(params[`${col.key}Min`])
            ? null
            : Number(params[`${col.key}Min`]),
          isEmpty(params[`${col.key}Max`])
            ? null
            : Number(params[`${col.key}Max`])
        );
      case 'date':
        return inRange(
          typeof value === 'string' ? localDay(value) : null,
          params[`${col.key}Min`],
          params[`${col.key}Max`]
        );
      default:
        break;
    }
    if (!filter) return true;
    switch (col.type) {
      case 'text':
        return (
          !isEmpty(value) &&
          String(value).toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        );
      case 'enum':
        return filter.split(',').includes(String(value));
      case 'select':
        return String(value) === filter;
      case 'bool':
        return String(Boolean(value)) === filter;
      case 'presence':
        return isEmpty(value) === (filter === 'null');
    }
  }

  /** Enums sort in the order of their options (e.g. Owner, Leader, Member), selects by label. */
  private sortRank(col: TableColumn): (value: unknown) => unknown {
    if (col.type !== 'enum' && col.type !== 'select') return (v) => v;
    const options = columnOptions(col);
    return (v) => {
      if (isEmpty(v)) return v;
      const i = options.findIndex((o) => o.value === String(v));
      if (col.type === 'select') return i === -1 ? String(v) : options[i].label;
      return i === -1 ? options.length : i;
    };
  }

  private flush(): void {
    const drafts = this.drafts();
    const changes: Record<string, string | null> = {};
    for (const [name, value] of Object.entries(drafts))
      changes[name] = value || null;
    void this.navigate(changes).then(() => {
      // Keep drafts typed meanwhile; drop the ones the URL now reflects.
      this.drafts.update((current) => {
        const next = { ...current };
        for (const [name, value] of Object.entries(drafts))
          if (next[name] === value) delete next[name];
        return next;
      });
    });
  }

  private navigate(changes: Record<string, string | null>): Promise<boolean> {
    const queryParams: Params = {};
    for (const [name, value] of Object.entries(changes))
      queryParams[this.prefix + name] = value;
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

export function columnOptions(column: TableColumn): readonly FilterOption[] {
  const { options } = column;
  return typeof options === 'function' ? options() : (options ?? []);
}

/** Options for an enum filter from a label map. */
export function enumOptions(labels: Readonly<Record<string, string>>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}
