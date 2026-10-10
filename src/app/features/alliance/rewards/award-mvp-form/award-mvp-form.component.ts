import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../../core/api/api-client';
import { AllianceEvent, RewardType } from '../../../../core/api/api.models';
import { MVP_TIERS, todayIsoDate } from '../../mvp-tiers';

export interface AwardablePlayer {
  id: string;
  name: string;
}

/** "Award MVP" form: player, tier (Normal by default), optional event and date (today by default). */
@Component({
  selector: 'app-award-mvp-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './award-mvp-form.component.html',
  styleUrls: ['./award-mvp-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwardMvpFormComponent {
  private readonly api = inject(ApiClient);

  readonly tiers = MVP_TIERS;

  players = input.required<AwardablePlayer[]>();
  events = input<AllianceEvent[]>([]);
  /** Hides the player picker, e.g. when awarding from a recommendation. */
  lockPlayer = input(false);
  playerId = model('');
  /** Emitted after the MVP was saved. */
  awarded = output<void>();

  tier = signal<RewardType>('Normal');
  eventId = signal('');
  date = signal(todayIsoDate());
  saving = signal(false);
  error = signal<string | null>(null);

  playerName(): string {
    return this.players().find((p) => p.id === this.playerId())?.name ?? '';
  }

  async submit(): Promise<void> {
    const playerId = this.playerId();
    if (!playerId || this.saving()) return;

    this.saving.set(true);
    this.error.set(null);
    try {
      const date = this.date();
      await firstValueFrom(
        this.api.createReward({
          playerId,
          type: this.tier(),
          eventId: this.eventId() || null,
          // Today: let the server stamp the current time so same-day MVPs keep their order.
          awardedAt:
            date && date !== todayIsoDate()
              ? new Date(date).toISOString()
              : undefined,
        })
      );
      this.tier.set('Normal');
      this.eventId.set('');
      this.date.set(todayIsoDate());
      if (!this.lockPlayer()) this.playerId.set('');
      this.awarded.emit();
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.saving.set(false);
    }
  }
}
