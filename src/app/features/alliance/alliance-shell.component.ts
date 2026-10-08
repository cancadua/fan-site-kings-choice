import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { apiErrorMessage } from '../../core/api/api-client';
import { SessionService } from '../../core/auth/session.service';
import { AllianceStateService } from './alliance-state.service';

@Component({
  selector: 'app-alliance-shell',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './alliance-shell.component.html',
  styleUrls: ['./alliance-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllianceShellComponent {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly state = inject(AllianceStateService);

  readonly navLinks = [{ label: 'Dashboard', route: '/alliance' }];

  newName = signal('');
  creating = signal(false);
  createError = signal<string | null>(null);

  constructor() {
    void this.state.load();
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
