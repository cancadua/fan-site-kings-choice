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
import { AllianceEvent, MvpRecommendation } from '../../../core/api/api.models';
import { AppModalComponent } from '../../../shared/app-modal/app-modal.component';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';
import { AwardMvpFormComponent } from '../rewards/award-mvp-form/award-mvp-form.component';

@Component({
  selector: 'app-alliance-mvp',
  standalone: true,
  imports: [
    SortHeaderComponent,
    FilterRowComponent,
    DatePipe,
    AppModalComponent,
    AwardMvpFormComponent,
  ],
  templateUrl: './alliance-mvp.component.html',
  styleUrls: ['./alliance-mvp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceMvpComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  recommendations = signal<MvpRecommendation[]>([]);
  readonly table = new TableQuery([
    { key: 'rank', type: 'none' },
    { key: 'player', type: 'text', label: 'Player' },
    { key: 'score', type: 'number', label: 'Score' },
    { key: 'lastMvp', type: 'date', label: 'Last MVP' },
    { key: 'normalRewards', type: 'number', label: 'Normal' },
    { key: 'earlRewards', type: 'number', label: 'Earl' },
    { key: 'dukeRewards', type: 'number', label: 'Duke' },
    { key: 'actions', type: 'none' },
  ]);
  loading = signal(false);
  error = signal<string | null>(null);
  events = signal<AllianceEvent[]>([]);
  /** Recommendation whose "Award MVP" form is open. */
  awarding = signal<MvpRecommendation | null>(null);

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      this.table.params();
      if (alliance) void this.load(alliance.id);
    });
  }

  async onAwarded(): Promise<void> {
    this.awarding.set(null);
    const alliance = this.state.selected();
    if (alliance) await this.load(alliance.id);
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const params = this.table.params();
    try {
      const [list, events] = await Promise.all([
        firstValueFrom(
          this.api.mvpRecommendations(allianceId, undefined, params)
        ),
        firstValueFrom(this.api.events(allianceId)),
      ]);
      if (
        this.state.selected()?.id === allianceId &&
        this.table.params() === params
      ) {
        this.recommendations.set(list);
        this.events.set(events);
      }
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
