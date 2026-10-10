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
  /** Column name in the API (the JSON field name). */
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

/**
 * Sorting and filtering state of one table, kept in the URL query string so it
 * survives a refresh and can be shared. `params` is what goes to the API.
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

  /** Params for the API (without the prefix); the same object while they do not change. */
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

  /** Cycles the column through ascending, descending and the API's default order. */
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
