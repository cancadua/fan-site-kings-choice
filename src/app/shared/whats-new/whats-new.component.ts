import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LATEST_UPDATE } from '../../core/constants/updates';

const DISMISSED_KEY = 'kc.dismissedUpdate';

@Component({
  selector: 'app-whats-new',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './whats-new.component.html',
  styleUrl: './whats-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsNewComponent {
  protected readonly update = LATEST_UPDATE;
  protected readonly dismissed = signal(this.wasDismissed());

  protected dismiss(): void {
    this.dismissed.set(true);
    try {
      localStorage.setItem(DISMISSED_KEY, this.update.id);
    } catch {
      // Storage can be blocked; the banner then simply returns on next visit.
    }
  }

  private wasDismissed(): boolean {
    try {
      return localStorage.getItem(DISMISSED_KEY) === this.update.id;
    } catch {
      return false;
    }
  }
}
