import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  ApiClient,
  apiErrorMessage,
  isHttpStatus,
} from '../../../core/api/api-client';
import {
  InviteRequest,
  LinkCode,
  LinkRequest,
  ListParams,
  Player,
  PlayerColor,
} from '../../../core/api/api.models';
import { AppModalComponent } from '../../../shared/app-modal/app-modal.component';
import { FilterRowComponent } from '../../../shared/table-query/filter-row.component';
import { SortHeaderComponent } from '../../../shared/table-query/sort-header.component';
import { TableQuery } from '../../../shared/table-query/table-query';
import { AllianceStateService } from '../alliance-state.service';
import { PLAYER_COLORS, playerColor } from '../player-colors';

type InviteRole = NonNullable<InviteRequest['role']>;

@Component({
  selector: 'app-alliance-players',
  standalone: true,
  imports: [
    SortHeaderComponent,
    FilterRowComponent,
    DatePipe,
    FormsModule,
    AppModalComponent,
  ],
  templateUrl: './alliance-players.component.html',
  styleUrls: ['./alliance-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlliancePlayersComponent {
  private readonly api = inject(ApiClient);
  readonly state = inject(AllianceStateService);

  /** Roles an Owner can grant when inviting; a Leader always invites as Member. */
  readonly inviteRoles: InviteRole[] = ['Member', 'Leader'];
  readonly colors = PLAYER_COLORS;
  readonly playerColor = playerColor;

  players = signal<Player[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  info = signal<string | null>(null);

  newName = signal('');
  newActivity = signal(50);
  newColor = signal<PlayerColor>('None');

  readonly table = new TableQuery([
    { key: 'name', type: 'text', label: 'Name' },
    {
      key: 'username',
      type: 'presence',
      label: 'Account',
      presentLabel: 'Linked',
      absentLabel: 'No account',
    },
    {
      key: 'color',
      type: 'enum',
      label: 'Color',
      options: PLAYER_COLORS.map(({ value, label }) => ({ value, label })),
    },
    { key: 'activity', type: 'number', label: 'Activity' },
    { key: 'isActive', type: 'bool', label: 'Active' },
    { key: 'actions', type: 'none' },
  ]);

  /** Link requests table; its params are prefixed to keep them apart from the players'. */
  readonly requestTable = new TableQuery(
    [
      { key: 'username', type: 'text', label: 'Account' },
      { key: 'playerName', type: 'text', label: 'Player' },
      { key: 'message', type: 'text', label: 'Message' },
      { key: 'createdAt', type: 'date', label: 'Sent' },
      { key: 'actions', type: 'none' },
    ],
    'req.'
  );
  /** Filtered/sorted pending requests; null while the table shows them as they are. */
  private readonly queriedRequests = signal<LinkRequest[] | null>(null);
  readonly requests = computed(
    () => this.queriedRequests() ?? this.state.pendingRequests()
  );

  isOwner = computed(() => this.state.selected()?.myRole === 'Owner');

  /** Code just generated for a player; it can't be read again later. */
  issuedCode = signal<{ player: Player; code: LinkCode } | null>(null);
  copied = signal(false);

  invitePlayer = signal<Player | null>(null);
  inviteUser = signal('');
  inviteRole = signal<InviteRole>('Member');
  inviting = signal(false);
  inviteError = signal<string | null>(null);

  /** Linked player whose deletion needs explicit confirmation (API answered 409). */
  confirmDeletePlayer = signal<Player | null>(null);

  constructor() {
    effect(() => {
      const allianceId = this.state.selectedId();
      this.table.params();
      if (allianceId) void this.load(allianceId);
    });
    effect(() => {
      const allianceId = this.state.selectedId();
      const params = this.requestTable.params();
      // Reload when the pending list changes (accepted, rejected, new).
      this.state.pendingRequests();
      if (!allianceId || Object.keys(params).length === 0) {
        this.queriedRequests.set(null);
        return;
      }
      void untracked(() => this.loadRequests(allianceId, params));
    });
  }

  async add(): Promise<void> {
    const alliance = this.state.selected();
    const name = this.newName().trim();
    if (!alliance || !name) return;

    await this.run(async () => {
      await firstValueFrom(
        this.api.createPlayer({
          allianceId: alliance.id,
          name,
          activity: this.clampActivity(this.newActivity()),
          color: this.newColor(),
        })
      );
      this.newName.set('');
      this.newActivity.set(50);
      this.newColor.set('None');
      await this.load(alliance.id);
    });
  }

  async setActivity(player: Player, event: Event): Promise<void> {
    const activity = this.clampActivity(
      Number((event.target as HTMLInputElement).value)
    );
    if (activity === player.activity) return;
    await this.update(player, { activity });
  }

  async setColor(player: Player, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const color = select.value as PlayerColor;
    if (color === player.color) return;
    await this.update(player, { color });
    // If saving failed the list still holds the old color; put the select back.
    if (this.error()) select.value = player.color;
  }

  toggleActive(player: Player): Promise<void> {
    return this.update(player, { isActive: !player.isActive });
  }

  async remove(player: Player): Promise<void> {
    if (!confirm(`Delete ${player.name} and all their rewards?`)) return;
    await this.run(async () => {
      try {
        await firstValueFrom(this.api.deletePlayer(player.id));
      } catch (err) {
        // The player has a linked account: ask again, naming the account.
        if (isHttpStatus(err, 409)) {
          this.confirmDeletePlayer.set(player);
          return;
        }
        throw err;
      }
      this.players.update((list) => list.filter((p) => p.id !== player.id));
    });
  }

  async confirmDelete(): Promise<void> {
    const player = this.confirmDeletePlayer();
    if (!player) return;
    this.confirmDeletePlayer.set(null);
    await this.run(async () => {
      await firstValueFrom(this.api.deletePlayer(player.id, true));
      this.info.set(
        `${player.name} was deleted and ${player.username ?? 'the linked account'} was removed from the alliance.`
      );
      await this.refreshLinks();
    });
  }

  async generateCode(player: Player): Promise<void> {
    await this.run(async () => {
      const code = await firstValueFrom(this.api.createLinkCode(player.id));
      this.copied.set(false);
      this.issuedCode.set({ player, code });
    });
  }

  async copyCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
    } catch {
      // Clipboard blocked (e.g. insecure context); the code stays selectable.
      this.copied.set(false);
    }
  }

  openInvite(player: Player): void {
    this.invitePlayer.set(player);
    this.inviteUser.set('');
    this.inviteRole.set('Member');
    this.inviteError.set(null);
  }

  async invite(): Promise<void> {
    const alliance = this.state.selected();
    const player = this.invitePlayer();
    const user = this.inviteUser().trim();
    if (!alliance || !player || !user || this.inviting()) return;

    this.inviting.set(true);
    this.inviteError.set(null);
    try {
      await firstValueFrom(
        this.api.invite(alliance.id, {
          user,
          playerId: player.id,
          role: this.isOwner() ? this.inviteRole() : 'Member',
        })
      );
      this.invitePlayer.set(null);
      await this.run(() => this.refreshLinks());
      this.info.set(`${user} is now linked to ${player.name}.`);
    } catch (err) {
      this.inviteError.set(apiErrorMessage(err));
    } finally {
      this.inviting.set(false);
    }
  }

  async unlink(player: Player): Promise<void> {
    const account = player.username ?? 'the linked account';
    if (
      !confirm(
        `Unlink ${account} from ${player.name}? The player and its rewards stay, and the account stays in the alliance.`
      )
    )
      return;
    await this.run(async () => {
      await firstValueFrom(this.api.unlinkPlayer(player.id));
      this.info.set(`${account} was unlinked from ${player.name}.`);
      await this.refreshLinks();
    });
  }

  async acceptRequest(request: LinkRequest): Promise<void> {
    await this.run(async () => {
      await firstValueFrom(this.api.acceptLinkRequest(request.id));
      this.info.set(
        `${request.username} is now linked to ${request.playerName}.`
      );
      await this.refreshLinks();
    });
  }

  async rejectRequest(request: LinkRequest): Promise<void> {
    await this.run(async () => {
      await firstValueFrom(this.api.rejectLinkRequest(request.id));
      await this.state.loadPendingRequests();
    });
  }

  /** Places a row menu (a top-layer popover) under its trigger button. */
  placeMenu(event: Event, trigger: HTMLElement): void {
    if ((event as ToggleEvent).newState !== 'open') return;
    const menu = event.target as HTMLElement;
    const rect = trigger.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
  }

  private update(
    player: Player,
    patch: { activity?: number; isActive?: boolean; color?: PlayerColor }
  ): Promise<void> {
    return this.run(async () => {
      const updated = await firstValueFrom(
        this.api.updatePlayer(player.id, patch)
      );
      this.players.update((list) =>
        list.map((p) => (p.id === updated.id ? updated : p))
      );
    });
  }

  private clampActivity(value: number): number {
    return Number.isFinite(value)
      ? Math.min(100, Math.max(0, Math.round(value)))
      : 50;
  }

  /**
   * Reloads what a link change affects: players, pending requests and the
   * alliance list (the user may have linked or removed their own account).
   */
  private async refreshLinks(): Promise<void> {
    const allianceId = this.state.selectedId();
    if (!allianceId) return;
    await Promise.all([
      this.loadPlayers(allianceId),
      this.state.loadPendingRequests(),
      this.state.load(),
    ]);
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    await this.run(() => this.loadPlayers(allianceId));
    this.loading.set(false);
  }

  private async loadPlayers(allianceId: string): Promise<void> {
    const params = this.table.params();
    const players = await firstValueFrom(this.api.players(allianceId, params));
    if (
      this.state.selectedId() === allianceId &&
      this.table.params() === params
    )
      this.players.set(players);
  }

  private async loadRequests(
    allianceId: string,
    params: ListParams
  ): Promise<void> {
    try {
      const requests = await firstValueFrom(
        this.api.allianceLinkRequests(allianceId, 'Pending', params)
      );
      if (this.requestTable.params() === params)
        this.queriedRequests.set(requests);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    }
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.error.set(null);
    this.info.set(null);
    try {
      await action();
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    }
  }
}
