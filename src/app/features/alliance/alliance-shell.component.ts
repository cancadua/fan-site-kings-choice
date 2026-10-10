import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { apiErrorMessage } from '../../core/api/api-client';
import { SessionService } from '../../core/auth/session.service';
import { ALLIANCE_SECTIONS } from './alliance-sections';
import { AllianceStateService } from './alliance-state.service';
import { AllianceLinkAccountComponent } from './link-account/alliance-link-account.component';

@Component({
  selector: 'app-alliance-shell',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AllianceLinkAccountComponent,
  ],
  templateUrl: './alliance-shell.component.html',
  styleUrls: ['./alliance-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceShellComponent {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly state = inject(AllianceStateService);

  /** Sections the user's role in the selected alliance may open. */
  readonly navLinks = computed(() => {
    const role = this.state.selected()?.myRole;
    return ALLIANCE_SECTIONS.filter((s) => role && s.roles.includes(role)).map(
      (s) => ({ ...s, route: s.path ? `/alliance/${s.path}` : '/alliance' })
    );
  });

  newName = signal('');
  creating = signal(false);
  createError = signal<string | null>(null);

  constructor() {
    void this.state.load();

    effect(() => {
      // Re-run when another alliance is selected or the user's role changes.
      this.state.selectedId();
      this.state.isManager();
      void untracked(() => this.state.loadPendingRequests());
    });

    // Switching to an alliance with a lower role may leave the user on a
    // section that role can't open; send them to the alliance home instead.
    effect(() => {
      const role = this.state.selected()?.myRole;
      if (!role) return;
      const path = this.router.url
        .split(/[?#]/)[0]
        .replace(/^\/alliance\/?/, '')
        .split('/')[0];
      const section = ALLIANCE_SECTIONS.find((s) => s.path === path);
      if (section && !section.roles.includes(role))
        void this.router.navigate(['/alliance']);
    });
  }

  onSelect(event: Event): void {
    this.state.select((event.target as HTMLSelectElement).value);
  }

  async create(): Promise<void> {
    const name = this.newName().trim();
    if (name.length < 2 || this.creating()) return;

    this.creating.set(true);
    this.createError.set(null);
    try {
      await this.state.create(name);
      this.newName.set('');
    } catch (err) {
      this.createError.set(apiErrorMessage(err));
    } finally {
      this.creating.set(false);
    }
  }

  signOut(): void {
    this.session.clear();
    this.state.reset();
    void this.router.navigate(['/login']);
  }
}
