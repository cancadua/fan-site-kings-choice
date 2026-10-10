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
import { ListParams, Reward } from '../../../core/api/api.models';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';
import { MVP_TIER_BADGE, MVP_TIER_OPTIONS } from '../mvp-tiers';

/** What a plain Member sees: their own player and its rewards. */
@Component({
  selector: 'app-alliance-my-player',
  standalone: true,
  imports: [SortHeaderComponent, FilterRowComponent, DatePipe, RouterLink],
  templateUrl: './alliance-my-player.component.html',
  styleUrls: ['./alliance-my-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceMyPlayerComponent {
  private readonly api = inject(ApiClient);
  readonly state = inject(AllianceStateService);

  readonly tierBadge = MVP_TIER_BADGE;
  readonly table = new TableQuery([
    { key: 'awardedAt', type: 'date', label: 'Date' },
    { key: 'type', type: 'enum', label: 'Award', options: MVP_TIER_OPTIONS },
  ]);

  rewards = signal<Reward[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const playerId = this.state.selected()?.myPlayerId;
      const params = this.table.params();
      if (playerId) void this.load(playerId, params);
      else this.rewards.set([]);
    });
  }

  private async load(playerId: string, params: ListParams): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rewards = await firstValueFrom(
        this.api.playerRewards(playerId, params)
      );
      if (
        this.state.selected()?.myPlayerId === playerId &&
        this.table.params() === params
      )
        this.rewards.set(rewards);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
