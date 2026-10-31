import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/enums/events';

@Component({
  selector: 'app-home-tools-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-tools-section.component.html',
  styleUrls: ['./home-tools-section.component.scss'],
})
export class HomeToolsSectionComponent {
  protected readonly tools = [
    {
      title: 'Uncharted Waters Planner',
      text: 'Pick the best cities for your team on the interactive map and share the plan with a short link.',
      icon: '🗺️',
      route: '/events',
      queryParams: { event: Event.UnchartedWaters, tab: 'cities-tool' },
    },
    {
      title: 'Knight Development',
      text: 'Advanced guides on hidden mechanics, optimization and competitive strategies.',
      icon: '⚔️',
      route: '/knight-development',
      queryParams: {},
    },
    {
      title: 'Alliance Hub',
      text: 'Track members and rewards for your alliance. Sign in to get started.',
      icon: '🛡️',
      route: '/alliance',
      queryParams: {},
    },
  ];
}
