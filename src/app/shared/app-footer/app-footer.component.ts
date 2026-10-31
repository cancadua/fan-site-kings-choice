import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KOFI_URL } from '../../core/constants/links';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly kofiUrl = KOFI_URL;
}
