import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/enums/events';
import { SiteSearch } from '../../core/search/site-search.service';
import { EVENTS_NAV } from '../../features/events/events.data';
import { AppIconComponent } from '../app-icon/app-icon.component';

interface Spark {
  left: string;
  size: string;
  duration: string;
  delay: string;
  warm: boolean;
}

/** Home page hero: tavern artwork, torches, embers, the main actions and search. */
@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroComponent {
  protected readonly search = inject(SiteSearch);
  protected readonly plannerEvent = Event.UnchartedWaters;
  protected readonly guideCount = EVENTS_NAV.length;

  /** Floating embers; each gets its own spot, size and speed. */
  protected readonly sparks: Spark[] = Array.from({ length: 16 }, (_, n) => {
    const i = n + 1;
    return {
      left: `${i * 6}%`,
      size: `${2 + (i % 3)}px`,
      duration: `${5 + (i % 5) * 1.3}s`,
      delay: `${-i * 0.8}s`,
      warm: i % 2 === 0,
    };
  });
}
