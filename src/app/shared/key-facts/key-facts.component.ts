import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { NavHubFact } from '../nav-hub/nav-hub.schema';

/** A strip of at-a-glance facts (duration, team size, costs) under a title. */
@Component({
  selector: 'app-key-facts',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <ul class="key-facts" aria-label="Key facts">
      @for (fact of facts(); track fact.label) {
        <li class="key-fact">
          <app-icon class="key-fact__icon" [name]="fact.icon" />
          <span class="key-fact__label">{{ fact.label }}</span>
          <span class="key-fact__value">{{ fact.value }}</span>
        </li>
      }
    </ul>
  `,
  styleUrl: './key-facts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyFactsComponent {
  readonly facts = input.required<NavHubFact[]>();
}
