import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  readonly rows = computed(() => this.table.apply(this.recommendations()));
  loading = signal(false);
  error = signal<string | null>(null);
  events = signal<AllianceEvent[]>([]);
  /** Recommendation whose "Award MVP" form is open. */
  awarding = signal<MvpRecommendation | null>(null);

  constructor() {
    effect(() => {
      const allianceId = this.state.selectedId();
      if (allianceId) void this.load(allianceId);
    });
  }

  async onAwarded(): Promise<void> {
    this.awarding.set(null);
    const allianceId = this.state.selectedId();
    if (allianceId) await this.load(allianceId, false);
  }

  /** Scores change with every award, so they are reloaded; events only with the alliance. */
  private async load(allianceId: string, withEvents = true): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [list, events] = await Promise.all([
        firstValueFrom(this.api.mvpRecommendations(allianceId)),
        withEvents ? firstValueFrom(this.api.events(allianceId)) : null,
      ]);
      if (this.state.selectedId() === allianceId) {
        this.recommendations.set(list);
        if (events) this.events.set(events);
      }
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
