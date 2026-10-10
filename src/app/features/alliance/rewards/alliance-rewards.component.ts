import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import {
  AllianceEvent,
  Player,
  Reward,
  RewardType,
} from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

export const REWARD_TYPES: RewardType[] = ['Normal', 'Blue', 'Purple', 'Mvp'];

@Component({
  selector: 'app-alliance-rewards',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './alliance-rewards.component.html',
  styleUrls: ['./alliance-rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceRewardsComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  readonly types = REWARD_TYPES;

  rewards = signal<Reward[]>([]);
  players = signal<Player[]>([]);
  events = signal<AllianceEvent[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  playerId = signal('');
  type = signal<RewardType>('Normal');
  eventId = signal('');

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
    });
  }

  async add(): Promise<void> {
    const alliance = this.state.selected();
    if (!alliance || !this.playerId()) return;

    await this.run(async () => {
      await firstValueFrom(
        this.api.createReward({
          playerId: this.playerId(),
          type: this.type(),
          eventId: this.eventId() || null,
        })
      );
      await this.loadRewards(alliance.id);
    });
  }

  async remove(reward: Reward): Promise<void> {
    if (!confirm(`Remove ${reward.type} reward for ${reward.playerName}?`))
      return;
    await this.run(async () => {
      await firstValueFrom(this.api.deleteReward(reward.id));
      this.rewards.update((list) => list.filter((r) => r.id !== reward.id));
    });
  }

  eventName(id: string | null): string {
    return this.events().find((e) => e.id === id)?.name ?? '';
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    await this.run(async () => {
      const [players, events, rewards] = await Promise.all([
        firstValueFrom(this.api.players(allianceId)),
        firstValueFrom(this.api.events(allianceId)),
        firstValueFrom(this.api.rewards(allianceId)),
      ]);
      if (this.state.selected()?.id !== allianceId) return;
      this.players.set(players.filter((p) => p.isActive));
      this.events.set(events);
      this.rewards.set(rewards);
      this.playerId.set('');
      this.eventId.set('');
    });
    this.loading.set(false);
  }

  private async loadRewards(allianceId: string): Promise<void> {
    const rewards = await firstValueFrom(this.api.rewards(allianceId));
    if (this.state.selected()?.id === allianceId) this.rewards.set(rewards);
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
