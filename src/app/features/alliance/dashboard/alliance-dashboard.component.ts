import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { AllianceStats, RewardTotals } from '../../../core/api/api.models';
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
  readonly rows = computed(() => this.table.apply(this.stats()?.players ?? []));
  /** The alliance's totals, or those of the filtered players. */
  readonly totals = computed<RewardTotals | null>(() => {
    const stats = this.stats();
    if (!stats || !this.table.hasFilters()) return stats?.totals ?? null;
    return this.rows().reduce(
      (sum, p) => ({
        normal: sum.normal + p.normal,
        earl: sum.earl + p.earl,
        duke: sum.duke + p.duke,
        total: sum.total + p.total,
      }),
      { normal: 0, earl: 0, duke: 0, total: 0 }
    );
  });
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      // Plain Members can't read alliance stats; they get their own view.
      const allianceId = this.state.selectedId();
      if (allianceId && this.state.isManager()) void this.load(allianceId);
    });
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const stats = await firstValueFrom(this.api.stats(allianceId));
      // Ignore a stale response (switched alliance meanwhile).
      if (this.state.selectedId() === allianceId) this.stats.set(stats);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
