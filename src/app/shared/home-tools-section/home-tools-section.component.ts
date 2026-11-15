import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/enums/events';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { IconName } from '../app-icon/icons';
import { SectionHeadingComponent } from '../section-heading/section-heading.component';

interface Tool {
  title: string;
  text: string;
  icon: IconName;
  route: string;
  queryParams: Record<string, string>;
}

@Component({
  selector: 'app-home-tools-section',
  standalone: true,
  imports: [RouterLink, AppIconComponent, SectionHeadingComponent],
  templateUrl: './home-tools-section.component.html',
  styleUrls: ['./home-tools-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeToolsSectionComponent {
  protected readonly tools: Tool[] = [
    {
      title: 'Uncharted Waters Planner',
      text: 'Sort cities by hand on the interactive map and share the plan with a short link. Not connected to the game.',
      icon: 'map',
      route: `/events/${Event.UnchartedWaters}`,
      queryParams: { tab: 'cities-tool' },
    },
    {
      title: 'Moves Calculators',
      text: 'See when your moves refill to the cap in Uncharted Waters, Reap What You Sow and School of Athens, so none go to waste.',
      icon: 'calculator',
      route: `/events/${Event.ReapWhatYouSow}`,
      queryParams: { tab: 'moves-calculator' },
    },
    {
      title: 'Knight Development',
      text: 'Advanced guides on how the mechanics work, optimization and competitive strategies.',
      icon: 'swords',
      route: '/knight-development/overview',
      queryParams: {},
    },
    {
      title: 'Alliance Hub',
      text: 'A private notebook for alliance leaders: members, events and MVP awards you record by hand. Not connected to the game.',
      icon: 'shield',
      route: '/alliance',
      queryParams: {},
    },
  ];
}
