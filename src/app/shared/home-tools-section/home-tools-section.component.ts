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
      text: 'A planning board: sort cities by hand on the interactive map and share the plan with a short link. Not connected to the game.',
      icon: '🗺️',
      route: `/events/${Event.UnchartedWaters}`,
      queryParams: { tab: 'cities-tool' },
    },
    {
      title: 'Knight Development',
      text: 'Advanced guides on how the mechanics work, optimization and competitive strategies.',
      icon: '⚔️',
      route: '/knight-development/overview',
      queryParams: {},
    },
    {
      title: 'Alliance Hub',
      text: 'A private notebook for alliance leaders: members, events and MVP awards you record by hand. Not connected to the game.',
      icon: '🛡️',
      route: '/alliance',
      queryParams: {},
    },
  ];
}
