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
import { Reward } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

/** What a plain Member sees: their own player and its rewards. */
@Component({
  selector: 'app-alliance-my-player',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './alliance-my-player.component.html',
  styleUrls: ['./alliance-my-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceMyPlayerComponent {
  private readonly api = inject(ApiClient);
  readonly state = inject(AllianceStateService);

  rewards = signal<Reward[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const playerId = this.state.selected()?.myPlayerId;
      this.rewards.set([]);
      if (playerId) void this.load(playerId);
    });
  }

  private async load(playerId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rewards = await firstValueFrom(this.api.playerRewards(playerId));
      if (this.state.selected()?.myPlayerId === playerId)
        this.rewards.set(rewards);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
