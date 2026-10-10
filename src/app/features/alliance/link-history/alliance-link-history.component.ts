import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import {
  ListParams,
  PlayerLinkAction,
  PlayerLinkLogEntry,
  PlayerLinkMethod,
} from '../../../core/api/api.models';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import {
  TableQuery,
  enumOptions,
} from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';

export const LINK_ACTION_LABELS: Record<PlayerLinkAction, string> = {
  Linked: 'Linked',
  Unlinked: 'Unlinked',
};

export const LINK_METHOD_LABELS: Record<PlayerLinkMethod, string> = {
  Code: 'code',
  Invite: 'invite',
  Request: 'request',
  Unlink: 'unlink',
  MemberRemoved: 'removed from alliance',
  PlayerDeleted: 'player deleted',
};

/** Audit trail of account links and unlinks in the selected alliance. */
@Component({
  selector: 'app-alliance-link-history',
  standalone: true,
  imports: [SortHeaderComponent, FilterRowComponent, DatePipe],
  templateUrl: './alliance-link-history.component.html',
  styleUrls: ['./alliance-link-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceLinkHistoryComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  readonly actionLabels = LINK_ACTION_LABELS;
  readonly methodLabels = LINK_METHOD_LABELS;
  readonly table = new TableQuery([
    { key: 'createdAt', type: 'date', label: 'Date' },
    {
      key: 'action',
      type: 'enum',
      label: 'Action',
      options: enumOptions(LINK_ACTION_LABELS),
    },
    { key: 'playerName', type: 'text', label: 'Player' },
    { key: 'username', type: 'text', label: 'Account' },
    {
      key: 'method',
      type: 'enum',
      label: 'Method',
      options: enumOptions(LINK_METHOD_LABELS),
    },
    { key: 'actorUsername', type: 'text', label: 'By' },
  ]);

  entries = signal<PlayerLinkLogEntry[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const allianceId = this.state.selectedId();
      const params = this.table.params();
      if (allianceId) void this.load(allianceId, params);
    });
  }

  private async load(allianceId: string, params: ListParams): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const entries = await firstValueFrom(
        this.api.linkLog(allianceId, params)
      );
      // Ignore a stale response (another alliance or newer filters).
      if (
        this.state.selectedId() === allianceId &&
        this.table.params() === params
      )
        this.entries.set(entries);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
