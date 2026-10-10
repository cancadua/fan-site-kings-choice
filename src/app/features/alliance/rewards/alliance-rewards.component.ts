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
import { AllianceEvent, Player, Reward } from '../../../core/api/api.models';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';
import { MVP_TIER_BADGE, MVP_TIER_OPTIONS } from '../mvp-tiers';
import { AwardMvpFormComponent } from './award-mvp-form/award-mvp-form.component';

@Component({
  selector: 'app-alliance-rewards',
  standalone: true,
  imports: [
    SortHeaderComponent,
    FilterRowComponent,
    DatePipe,
    AwardMvpFormComponent,
  ],
  templateUrl: './alliance-rewards.component.html',
  styleUrls: ['./alliance-rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceRewardsComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  readonly tierBadge = MVP_TIER_BADGE;
  readonly table = new TableQuery([
    { key: 'awardedAt', type: 'date', label: 'Date' },
    { key: 'playerName', type: 'text', label: 'Player' },
    { key: 'type', type: 'enum', label: 'Award', options: MVP_TIER_OPTIONS },
    {
      key: 'eventId',
      type: 'select',
      label: 'Event',
      options: () => this.events().map((e) => ({ value: e.id, label: e.name })),
    },
    { key: 'actions', type: 'none' },
  ]);

  rewards = signal<Reward[]>([]);
  players = signal<Player[]>([]);
  events = signal<AllianceEvent[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const allianceId = this.state.selectedId();
      if (allianceId) void this.loadLookups(allianceId);
    });
    effect(() => {
      const allianceId = this.state.selectedId();
      this.table.params();
      if (allianceId) void this.load(allianceId);
    });
  }

  async onAwarded(): Promise<void> {
    const alliance = this.state.selected();
    if (alliance) await this.run(() => this.loadRewards(alliance.id));
  }

  async remove(reward: Reward): Promise<void> {
    if (!confirm(`Remove the ${reward.type} MVP of ${reward.playerName}?`))
      return;
    await this.run(async () => {
      await firstValueFrom(this.api.deleteReward(reward.id));
      this.rewards.update((list) => list.filter((r) => r.id !== reward.id));
    });
  }

  eventName(id: string | null): string {
    return this.events().find((e) => e.id === id)?.name ?? '';
  }

  /** Players for the award form; events for names and the filter. */
  private async loadLookups(allianceId: string): Promise<void> {
    await this.run(async () => {
      const [players, events] = await Promise.all([
        firstValueFrom(this.api.players(allianceId, { isActive: 'true' })),
        firstValueFrom(this.api.events(allianceId)),
      ]);
      if (this.state.selectedId() !== allianceId) return;
      this.players.set(players);
      this.events.set(events);
    });
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    await this.run(() => this.loadRewards(allianceId));
    this.loading.set(false);
  }

  private async loadRewards(allianceId: string): Promise<void> {
    const params = this.table.params();
    const rewards = await firstValueFrom(this.api.rewards(allianceId, params));
    if (
      this.state.selectedId() === allianceId &&
      this.table.params() === params
    )
      this.rewards.set(rewards);
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.error.set(null);
    try {
      await action();
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    }
  }
}
