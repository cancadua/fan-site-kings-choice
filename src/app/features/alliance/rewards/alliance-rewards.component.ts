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
import { AllianceStateService } from '../alliance-state.service';
import { MVP_TIER_BADGE } from '../mvp-tiers';
import { AwardMvpFormComponent } from './award-mvp-form/award-mvp-form.component';

@Component({
  selector: 'app-alliance-rewards',
  standalone: true,
  imports: [DatePipe, AwardMvpFormComponent],
  templateUrl: './alliance-rewards.component.html',
  styleUrls: ['./alliance-rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceRewardsComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  readonly tierBadge = MVP_TIER_BADGE;

  rewards = signal<Reward[]>([]);
  players = signal<Player[]>([]);
  events = signal<AllianceEvent[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
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
