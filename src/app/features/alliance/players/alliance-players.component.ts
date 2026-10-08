import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { Player } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

@Component({
  selector: 'app-alliance-players',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './alliance-players.component.html',
  styleUrls: ['./alliance-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlliancePlayersComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  players = signal<Player[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  newName = signal('');
  newActivity = signal(50);

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
    });
  }

  async add(): Promise<void> {
    const alliance = this.state.selected();
    const name = this.newName().trim();
    if (!alliance || !name) return;

    await this.run(async () => {
      await firstValueFrom(
        this.api.createPlayer({ allianceId: alliance.id, name, activity: this.clampActivity(this.newActivity()) }),
      );
      this.newName.set('');
      this.newActivity.set(50);
      await this.load(alliance.id);
    });
  }

  async setActivity(player: Player, event: Event): Promise<void> {
    const activity = this.clampActivity(Number((event.target as HTMLInputElement).value));
    if (activity === player.activity) return;
    await this.update(player, { activity });
  }

  toggleActive(player: Player): Promise<void> {
    return this.update(player, { isActive: !player.isActive });
  }

  async remove(player: Player): Promise<void> {
    if (!confirm(`Delete ${player.name} and all their rewards?`)) return;
    await this.run(async () => {
      await firstValueFrom(this.api.deletePlayer(player.id));
      this.players.update(list => list.filter(p => p.id !== player.id));
    });
  }

  private update(player: Player, patch: { activity?: number; isActive?: boolean }): Promise<void> {
    return this.run(async () => {
      const updated = await firstValueFrom(this.api.updatePlayer(player.id, patch));
      this.players.update(list => list.map(p => (p.id === updated.id ? updated : p)));
    });
  }

  private clampActivity(value: number): number {
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 50;
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    await this.run(async () => {
      const players = await firstValueFrom(this.api.players(allianceId));
      if (this.state.selected()?.id === allianceId) this.players.set(players);
    });
    this.loading.set(false);
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
