import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../../core/api/api-client';
import { AllianceRole, Member } from '../../../core/api/api.models';
import { AllianceStateService } from '../alliance-state.service';

@Component({
  selector: 'app-alliance-members',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './alliance-members.component.html',
  styleUrls: ['./alliance-members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceMembersComponent {
  private readonly api = inject(ApiClient);
  private readonly state = inject(AllianceStateService);

  /** Roles an owner can assign; the Owner role can't be granted. */
  readonly assignableRoles: AllianceRole[] = ['Leader', 'Member'];

  members = signal<Member[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  info = signal<string | null>(null);

  inviteEmail = signal('');
  inviteRole = signal<AllianceRole>('Leader');

  isOwner = computed(() => this.state.selected()?.myRole === 'Owner');

  constructor() {
    effect(() => {
      const alliance = this.state.selected();
      if (alliance) void this.load(alliance.id);
    });
  }

  async invite(): Promise<void> {
    const alliance = this.state.selected();
    const email = this.inviteEmail().trim();
    if (!alliance || !email) return;

    await this.run(async () => {
      await firstValueFrom(this.api.invite(alliance.id, { email, role: this.inviteRole() }));
      this.inviteEmail.set('');
      this.info.set(`${email} was added as ${this.inviteRole()}.`);
      await this.loadMembers(alliance.id);
    });
  }

  async changeRole(member: Member, event: Event): Promise<void> {
    const alliance = this.state.selected();
    const select = event.target as HTMLSelectElement;
    const role = select.value as AllianceRole;
    if (!alliance || role === member.role) return;

    await this.run(async () => {
      await firstValueFrom(this.api.changeMemberRole(alliance.id, member.userId, role));
      await this.loadMembers(alliance.id);
    });
    // If the change failed the list still holds the old role; put the select back.
    if (this.error()) select.value = member.role;
  }

  async remove(member: Member): Promise<void> {
    const alliance = this.state.selected();
    if (!alliance || !confirm(`Remove ${member.username} from the alliance?`)) return;

    await this.run(async () => {
      await firstValueFrom(this.api.removeMember(alliance.id, member.userId));
      await this.loadMembers(alliance.id);
    });
  }

  private async load(allianceId: string): Promise<void> {
    this.loading.set(true);
    await this.run(() => this.loadMembers(allianceId));
    this.loading.set(false);
  }

  private async loadMembers(allianceId: string): Promise<void> {
    const members = await firstValueFrom(this.api.members(allianceId));
    if (this.state.selected()?.id === allianceId) this.members.set(members);
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
