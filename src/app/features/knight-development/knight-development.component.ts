import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';

interface Paragraph {
  text: string[];
  items?: string[];
}

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  content: Paragraph[];
  subsections?: Subsection[];
}

interface Subsection {
  title: string;
  content: Paragraph[];
}

@Component({
  selector: 'app-knight-development',
  templateUrl: './knight-development.component.html',
  styleUrls: ['./knight-development.component.scss'],
  standalone: true,
  imports: [CommonModule, NavHubComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnightDevelopmentComponent {
  activeSection = 'overview';

  sections: Section[] = [
    {
      id: 'overview',
      title: 'Knight Development Guide',
      subtitle: 'Advanced Optimization for Serious Players',
      content: [
        {
          text: [
            'If you want to effectively use the resources and chances you have, knight development is crucial.',
            'The biggest mistake players make is trying to improve every knight.',
            'You instead should build a limited number of extremely specialized knights while hoarding resources for ranking events.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Knight Selection',
          content: [
            {
              text: [
                'There are few factors to consider while chosing the right knight from the available options of sets. The sets are specialized in one of the four attributes: Strength, Intellect, Leadership, and Charisma. Each set has a unique aura that benefits all knights in that set.',              
              ],
              items: [
                'Additional aura percentage bonuses',
                'Combined amount of talents in the main attribute',
                'Combined amount of talents in the main attribute',
              ],
            },
          ],
        },
      ]
    },
    {
      id: 'golden-rule',
      title: 'The Golden Rule',
      subtitle: 'The Foundation of Success',
      content: [
        {
          text: [
            'You should quickly have four main specialists, each maximized in their respective attribute.',
            'Many players incorrectly spread edicts across multiple knights, which permanently slows growth because talents and levels multiply each other.',
            'The game\'s attribute formula scales with both level and talents, so concentrating investment is mathematically superior.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Strength Specialist',
          content: [
            {
              text: [
                'Strength → Arthurian Knight. Guinevre, due to her 5★ intellect talent, is superior to other Arthurians for a quicker silver snowball; later in the game she is equal to the others in the set.',
              ],
              items: [
                'Knight Power',
                'War of Conquest',
                'Outpost',
                'Arena damage',
                'Scarlet Beauty',
                'School of Athens',
              ],
            },
          ],
        },
        {
          title: 'Intellect Specialist',
          content: [
            {
              text: [
                'Intellect → Monarch. In the very early game use Dante while focusing on his lover charm, then flawlessly migrate to Monarch once his aura becomes superior to Dante\'s intellect percentage lover boost.',
              ],
              items: [
                'Silver income → knight levels',
                'Naval Expeditions',
                'War of Conquest (crucial early game and for the long-term snowball)',
                'Snow Mountain Exploration',
                'Outpost',
              ],
            },
          ],
        },
        {
          title: 'Leadership Specialist',
          content: [
            {
              text: [
                'Leadership → Scholar. Da Vinci is superior at every point of the game: more leadership talents than Homer (the main Scholar attribute) and more Strength talents than the remaining Scholars, which is desired for multiple events. Prefer leadership over charisma because soldier income consumes grain.',
              ],
              items: [
                'Grain income → pet food',
                'Soldier production',
                'Outpost',
                'Realm Revival',
              ],
            },
          ],
        },
        {
          title: 'Charisma Specialist',
          content: [
            {
              text: ['Charisma → Epic Hero.'],
              items: [
                'Soldier production',
                'Outpost',
                'The Throne of Wolves',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'power-breakdown',
      title: 'Actual State Power',
      subtitle: 'Understanding the Math Behind Growth',
      content: [
        {
          text: [
            'Every knight\'s attribute roughly comes from: Level × Talent × Percentage Bonuses',
            'Percentage bonuses come from: Lovers, Aura, Negotiation, Decor, and some global buffs.',
            'Books are flat bonuses only - they do NOT scale with level.',
          ],
        },
      ],
      subsections: [
        {
          title: 'The Book Revelation',
          content: [
            {
              text: [
                'Putting a Strength Book on a Level 40 knight adds exactly the same State Power as putting it on a Level 500 knight.',
                'Books can safely be placed almost anywhere (unless planning Arena specialization).',
                'This surprises many players but is crucial to understand.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'intellect-priority',
      title: 'The Hidden Snowball',
      subtitle: 'Why Silver Income Is King',
      content: [
        {
          text: ['Most new players think Strength is king. Actually, high Intellect creates:'],
          items: ['More silver → More knight levels → More State Power → More Knight Power'],
        },
        {
          text: [
            'Silver income compounds forever. This is why almost every advanced guide recommends making Dante (or later a Monarch) one of your earliest priorities.',
            'Early game its really crucial, later in the game when you have just enough to keep up with armor collected, it becomes much less important and you focus on strength.',
          ],
        },
      ],
    },
    {
      id: 'edict-mathematics',
      title: 'Edict Mathematics',
      subtitle: 'Maximizing Talent Investment',
      content: [
        {
          text: [
            'Never use Strength edict on 2★ strength talent. Use it on 5★ or 6★ strength talent instead.',
            'Expected value is dramatically better at higher stars.',
            'Talent EXP should upgrade 1★, 2★, 3★, and 4★ talents where cost per upgrade is lower.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Advanced Strategy',
          content: [
            {
              text: [
                'Save attribute-specific edicts and spend them consecutively until a success once accumulated.',
                'Community testing suggests pity-like behavior, though this is based on player analysis rather than official documentation.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'knight-power',
      title: 'Knight Power vs State Power',
      subtitle: 'Two Different Metrics, Different Strategies',
      content: [
        {
          text: [
            'Knight Power is NOT your Strength Attribute. It depends mainly on: Knight Level, Strength Talents, Strength Books.',
            'Aura bonuses and lover percentage bonuses generally do NOT increase Knight Power, except when they directly add Strength talents.',
            'Approximate formula: Knight Power = 20 × Level × Strength Talents + Strength Book component',
          ],
        },
      ],
      subsections: [
        {
          title: 'Key Insight',
          content: [
            {
              text: [
                'A level 400 knight with huge strength talents beats a level 200 knight with massive aura.',
                'This is why Strength Books should be spread across permanent knights (square-root scaling diminishing returns).',
                '100 books on one knight is much worse than 10 books on ten knights.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'aura-knights',
      title: 'Aura Knights',
      subtitle: 'The Ultimate Knight Investment',
      content: [
        {
          text: [
            'Exchange Knights become your permanent core. Each new knight collected increases aura effectiveness across the set, making the whole set more valuable than focusing only one member.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Aura Sets',
          content: [
            {
              text: [],
              items: [
                'Arthurians → Strength aura',
                'Scholars → Leadership aura',
                'Monarchs → Intellect aura',
                'Epic Heroes → Charisma aura',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'progression-stages',
      title: 'Progression Stages',
      subtitle: 'How to Evolve Over Time',
      content: [
        {
          text: [
            'Your account progression follows distinct phases. Each requires different resource allocation and strategic focus.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Stage 1: Days 1-30',
          content: [
            {
              text: [
                'Objective: Unlock every daily activity, maximize silver production, establish four specialists.',
                'Forget rankings. The whales own the first month. You build the engine.',
              ],
            },
          ],
        },
        {
          title: 'Before Aura Knights',
          content: [
            {
              text: [],
              items: [
                'Strength → Edward > Magellan, yet you swap for arthurian very quickly.',
                'Leadership → Francis Drake > Galileo, you get aura Scholar really quickly',
                'Charisma → Edward > Bertrand',
                'Intellect → Dante > Magellan',
              ],
            },
          ],
        },
        {
          title: 'After Unlocking Aura Knights',
          content: [
            {
              text: [
                'Transition strength and leadership ASAP, intelligence and charisma just the moment the aura is better than the lover boosts.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'university-optimization',
      title: 'University Optimization',
      subtitle: 'Free Talent EXP Every Day',
      content: [
        {
          text: [
            'Many players waste University seats. Never leave seats empty - it\'s effectively free Talent EXP every day cycle.',
          ],
        },
      ],
      subsections: [
        {
          title: 'Rules',
          content: [
            {
              text: [],
              items: [
                'Keep your higest level knights in the University at all times.',
                'Keep your future investment knights, like high VIP or the secondaries waiting until mains are filled.',
              ],
            },
          ],
        },
      ],
    },
  ];

  getActiveSection(): Section | undefined {
    return this.sections.find(s => s.id === this.activeSection);
  }
}
