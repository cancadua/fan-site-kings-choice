import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiClient, apiErrorMessage } from '../../core/api/api-client';
import { SessionService } from '../../core/auth/session.service';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly api = inject(ApiClient);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  mode = signal<Mode>('login');
  email = signal('');
  username = signal('');
  password = signal('');
  busy = signal(false);
  error = signal<string | null>(null);

  constructor() {
    if (this.session.isLoggedIn()) void this.router.navigate(['/alliance']);
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.error.set(null);
  }

  async submit(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);

    try {
      const email = this.email().trim();
      const password = this.password();
      const response = await firstValueFrom(
        this.mode() === 'login'
          ? this.api.login({ email, password })
          : this.api.register({
              email,
              username: this.username().trim(),
              password,
            })
      );
      this.session.setToken(response.token);
      await this.router.navigate(['/alliance']);
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    } finally {
      this.busy.set(false);
    }
  }
}
