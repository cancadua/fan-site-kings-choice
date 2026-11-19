import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/enums/events';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { IconName } from '../app-icon/icons';
import { SectionHeadingComponent } from '../section-heading/section-heading.component';

interface Feature {
  icon: IconName;
  title: string;
  text: string;
  link: { label: string; route: string };
}

/** "Inside every guide": what the guide pages offer beyond plain text. */
@Component({
  selector: 'app-home-features',
  standalone: true,
  imports: [RouterLink, AppIconComponent, SectionHeadingComponent],
  template: `
    <section class="features">
      <app-section-heading
        eyebrow="Inside every guide"
        heading="More Than a Wall of Text"
        subtitle="Built for quick answers in the middle of an event"
      />
      <ul class="features__grid">
        @for (feature of features; track feature.title) {
          <li class="feature reveal-on-scroll">
            <span class="feature__icon"
              ><app-icon [name]="feature.icon"
            /></span>
            <h3 class="feature__title">{{ feature.title }}</h3>
            <p class="feature__text">{{ feature.text }}</p>
            <a class="feature__link" [routerLink]="feature.link.route"
              >{{ feature.link.label }} <app-icon name="chevronRight"
            /></a>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './home-features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFeaturesComponent {
  protected readonly features: Feature[] = [
    {
      icon: 'layers',
      title: 'Key numbers first',
      text: 'Duration, costs and caps in one strip at the top of each guide.',
      link: {
        label: 'See an example',
        route: `/events/${Event.StruggleForSupremacy}`,
      },
    },
    {
      icon: 'check',
      title: 'Smart Play checklists',
      text: 'Tick off each step as you go. Progress is saved in your browser.',
      link: {
        label: 'Open a checklist',
        route: `/events/${Event.SiegeOfTheUndead}/smart-play`,
      },
    },
    {
      icon: 'calculator',
      title: 'Moves calculators',
      text: 'See when your moves refill to the cap, so none go to waste.',
      link: {
        label: 'Try a calculator',
        route: `/events/${Event.ReapWhatYouSow}/moves-calculator`,
      },
    },
    {
      icon: 'book',
      title: 'Game terms explained',
      text: 'Tap an underlined term for a short definition, right in the text.',
      link: {
        label: 'Read a guide',
        route: `/events/${Event.SchoolOfAthens}`,
      },
    },
  ];
}
