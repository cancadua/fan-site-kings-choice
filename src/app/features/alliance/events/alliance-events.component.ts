import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { AllianceEvent } from '../../../core/api/api.models';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';

@Component({
  selector: 'app-alliance-events',
  standalone: true,
  imports: [SortHeaderComponent, FilterRowComponent, FormsModule],
  templateUrl: './alliance-events.component.html',
  styleUrls: ['./alliance-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceEventsComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  events = signal<AllianceEvent[]>([]);
  readonly table = new TableQuery([
    { key: 'name', type: 'text', label: 'Name' },
    { key: 'description', type: 'text', label: 'Description' },
    { key: 'actions', type: 'none' },
  ]);
  loading = signal(false);
  error = signal<string | null>(null);

  newName = signal('');
  newDescription = signal('');

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      const params = this.table.params();
      if (alliance) void this.load(alliance.id, params);
    });
  }

  async add(): Promise<void> {
    const alliance = this.state.selected();
    const name = this.newName().trim();
    if (!alliance || !name) return;

    await this.run(async () => {
      await firstValueFrom(
        this.api.createEvent({
          allianceId: alliance.id,
          name,
          description: this.newDescription().trim() || null,
        })
      );
      this.newName.set('');
      this.newDescription.set('');
      await this.load(alliance.id);
    });
  }

  async remove(event: AllianceEvent): Promise<void> {
    if (!confirm(`Delete "${event.name}"? Rewards given for it are kept.`))
      return;
    await this.run(async () => {
      await firstValueFrom(this.api.deleteEvent(event.id));
      this.events.update((list) => list.filter((e) => e.id !== event.id));
    });
  }

  private async load(
    allianceId: string,
    params = this.table.params()
  ): Promise<void> {
    this.loading.set(true);
    await this.run(async () => {
      const events = await firstValueFrom(this.api.events(allianceId, params));
      if (
        this.state.selected()?.id === allianceId &&
        this.table.params() === params
      )
        this.events.set(events);
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
