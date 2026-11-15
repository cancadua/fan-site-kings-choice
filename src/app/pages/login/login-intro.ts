import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';

/** Left panel of the sign-in page: what the Alliance Hub offers and what it never touches. */
@Component({
  selector: 'app-login-intro',
  imports: [AppIconComponent],
  templateUrl: './login-intro.html',
  styleUrl: './login-intro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginIntro {}
