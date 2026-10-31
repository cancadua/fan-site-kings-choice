import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/enums/events';

@Component({
  selector: 'app-home-events-highlight',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-events-highlight.component.html',
  styleUrls: ['./home-events-highlight.component.scss'],
})
export class HomeEventsHighlightComponent {
  protected readonly events = [
    {
      id: Event.UnchartedWaters,
      title: 'Uncharted Waters',
      label: 'City Selection Tool',
      icon: '🧭',
    },
    {
      id: Event.ReapWhatYouSow,
      title: 'Reap What You Sow',
      label: 'Flora & Fauna Event',
      icon: '🌾',
    },
    {
      id: Event.StruggleForSupremacy,
      title: 'Struggle for Supremacy',
      label: 'Alliance Season Event',
      icon: '⚔️',
    },
    {
      id: Event.SchoolOfAthens,
      title: 'School of Athens',
      label: '3-Player Team Event',
      icon: '📖',
    },
    {
      id: Event.SiegeOfTheUndead,
      title: 'Siege of the Undead',
      label: 'Alliance Defense Event',
      icon: '💀',
    },
  ];
}
