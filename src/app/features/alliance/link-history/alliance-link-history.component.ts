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
  PlayerLinkAction,
  PlayerLinkLogEntry,
  PlayerLinkMethod,
} from '../../../core/api/api.models';
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
  imports: [DatePipe],
  templateUrl: './alliance-link-history.component.html',
  styleUrls: ['./alliance-link-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceLinkHistoryComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  readonly actionLabels = LINK_ACTION_LABELS;
  readonly methodLabels = LINK_METHOD_LABELS;

  entries = signal<PlayerLinkLogEntry[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const allianceId = this.state.selectedId();
      if (allianceId) void this.load(allianceId);
    });
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const entries = await firstValueFrom(this.api.linkLog(allianceId));
      if (this.state.selectedId() === allianceId) this.entries.set(entries);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
