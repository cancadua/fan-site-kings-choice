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
import { MvpRecommendation } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

@Component({
  selector: 'app-alliance-mvp',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './alliance-mvp.component.html',
  styleUrls: ['./alliance-mvp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceMvpComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  recommendations = signal<MvpRecommendation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  awarding = signal<string | null>(null);

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
    });
  }

  async award(rec: MvpRecommendation): Promise<void> {
    const alliance = this.state.selected();
    if (!alliance || this.awarding()) return;
    if (!confirm(`Award MVP to ${rec.player}?`)) return;

    this.awarding.set(rec.playerId);
    this.error.set(null);
    try {
      await firstValueFrom(
        this.api.createReward({ playerId: rec.playerId, type: 'Mvp' })
      );
      await this.load(alliance.id);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.awarding.set(null);
    }
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const list = await firstValueFrom(
        this.api.mvpRecommendations(allianceId)
      );
      if (this.state.selected()?.id === allianceId)
        this.recommendations.set(list);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
