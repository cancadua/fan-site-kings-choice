import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LATEST_UPDATE } from '../../core/constants/updates';
import { EVENTS_NAV } from '../../features/events/events.data';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { SectionHeadingComponent } from '../section-heading/section-heading.component';

/**
 * Event cards on the home page. They use the same data as the Events page
 * (icon, facts, banner), so a new event or banner shows up here automatically.
 */
@Component({
  selector: 'app-home-events-highlight',
  standalone: true,
  imports: [RouterLink, AppIconComponent, SectionHeadingComponent],
  templateUrl: './home-events-highlight.component.html',
  styleUrls: ['./home-events-highlight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEventsHighlightComponent {
  protected readonly events = EVENTS_NAV;
  /** The event announced in the "What's new" banner gets a "New" ribbon. */
  protected readonly newRoute = LATEST_UPDATE.route;
}
