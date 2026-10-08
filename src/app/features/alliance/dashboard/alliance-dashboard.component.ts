import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { AllianceStats } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

@Component({
  selector: 'app-alliance-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './alliance-dashboard.component.html',
  styleUrls: ['./alliance-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceDashboardComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  stats = signal<AllianceStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
    });
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const stats = await firstValueFrom(this.api.stats(allianceId));
      // Ignore a stale response if the user switched alliance meanwhile.
      if (this.state.selected()?.id === allianceId) this.stats.set(stats);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
