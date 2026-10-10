import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { AllianceStats, ListParams } from '../../../core/api/api.models';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';
import { AllianceMyPlayerComponent } from '../my-player/alliance-my-player.component';

@Component({
  selector: 'app-alliance-dashboard',
  standalone: true,
  imports: [
    SortHeaderComponent,
    FilterRowComponent,
    DatePipe,
    RouterLink,
    AllianceMyPlayerComponent,
  ],
  templateUrl: './alliance-dashboard.component.html',
  styleUrls: ['./alliance-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceDashboardComponent {
  private readonly api = inject(ApiClient);
  readonly state = inject(AllianceStateService);

  stats = signal<AllianceStats | null>(null);
  readonly table = new TableQuery([
    { key: 'player', type: 'text', label: 'Player' },
    { key: 'total', type: 'number', label: 'MVPs' },
    { key: 'duke', type: 'number', label: 'Duke' },
    { key: 'earl', type: 'number', label: 'Earl' },
    { key: 'normal', type: 'number', label: 'Normal' },
    { key: 'lastReward', type: 'date', label: 'Last MVP' },
  ]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      // Plain Members can't read alliance stats; they get their own view.
      const alliance = this.state.selected();
      const params = this.table.params();
      if (alliance && this.state.isManager())
        void this.load(alliance.id, params);
    });
  }

  private async load(allianceId: string, params: ListParams): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const stats = await firstValueFrom(this.api.stats(allianceId, params));
      // Ignore a stale response (switched alliance or newer filters).
      if (
        this.state.selected()?.id === allianceId &&
        this.table.params() === params
      )
        this.stats.set(stats);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
