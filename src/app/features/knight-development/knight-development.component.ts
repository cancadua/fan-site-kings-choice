import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHubComponent } from '../../shared/nav-hub/nav-hub.component';

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  subsections?: Subsection[];
}

interface Subsection {
  title: string;
  content: string[];
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
        'If your goal is to become one of the strongest players on a server, knight development is where almost every resource decision matters.',
        'The biggest mistake players make is trying to improve every knight. The strongest accounts instead build a small number of extremely specialized knights while hoarding resources for ranking events.',
        'This is also the strategy used by top competitive alliances.',
      ],
    },
    {
      id: 'golden-rule',
      title: 'The Golden Rule',
      subtitle: 'The Foundation of Success',
      content: [
        'You should eventually have four main specialists, each maximized in their respective attribute. Many players incorrectly spread edicts across multiple knights, which permanently slows growth because talents and levels multiply each other.',
        'The game\'s attribute formula scales with both level and talents, so concentrating investment is mathematically superior.',
      ],
      subsections: [
        {
          title: 'Core Specialist Setup',
          content: [
            'Strength → Arthurian Knight (Knight Power, Outpost, Arena damage)',
            'Intellect → Dante → later Monarch (Silver economy)',
            'Leadership → Scholar (Grain)',
            'Charisma → Epic Hero (Soldier production)',
          ],
        },
      ],
    },
    {
      id: 'power-breakdown',
      title: 'Actual State Power',
      subtitle: 'Understanding the Math Behind Growth',
      content: [
        'Every knight\'s attribute roughly comes from: Level × Talent × Percentage Bonuses',
        'Percentage bonuses come from: Lovers, Aura, Negotiation, Decor, and some global buffs.',
        'Books are flat bonuses only - they do NOT scale with level.',
      ],
      subsections: [
        {
          title: 'The Book Revelation',
          content: [
            'Putting a Strength Book on a Level 40 knight adds exactly the same State Power as putting it on a Level 500 knight.',
            'Books can safely be placed almost anywhere (unless planning Arena specialization).',
            'This surprises many players but is crucial to understand.',
          ],
        },
      ],
    },
    {
      id: 'intellect-priority',
      title: 'The Hidden Snowball',
      subtitle: 'Why Silver Income Is King',
      content: [
        'Most new players think Strength is king. Actually, high Intellect creates:',
        '• More silver → More knight levels → More State Power → More Knight Power',
        'Silver income compounds forever. This is why almost every advanced guide recommends making Dante (or later a Monarch) one of your earliest priorities.',
      ],
    },
    {
      id: 'edict-mathematics',
      title: 'Edict Mathematics',
      subtitle: 'Maximizing Talent Investment',
      content: [
        'Never use Strength edict on 2★ strength talent. Use it on 5★ or 6★ strength talent instead.',
        'Expected value is dramatically better at higher stars.',
        'Talent EXP should upgrade 1★, 2★, 3★, and 4★ talents where cost per upgrade is lower.',
      ],
      subsections: [
        {
          title: 'Advanced Strategy',
          content: [
            'Save attribute-specific edicts and spend them consecutively until a success once accumulated.',
            'Community testing suggests pity-like behavior, though this is based on player analysis rather than official documentation.',
          ],
        },
      ],
    },
    {
      id: 'knight-power',
      title: 'Knight Power vs State Power',
      subtitle: 'Two Different Metrics, Different Strategies',
      content: [
        'Knight Power is NOT your Strength Attribute. It depends mainly on: Knight Level, Strength Talents, Strength Books.',
        'Aura bonuses and lover percentage bonuses generally do NOT increase Knight Power, except when they directly add Strength talents.',
        'Approximate formula: Knight Power = 20 × Level × Strength Talents + Strength Book component',
      ],
      subsections: [
        {
          title: 'Key Insight',
          content: [
            'A level 400 knight with huge strength talents beats a level 200 knight with massive aura.',
            'This is why Strength Books should be spread across permanent knights (square-root scaling diminishing returns).',
            '100 books on one knight is much worse than 10 books on ten knights.',
          ],
        },
      ],
    },
    {
      id: 'aura-knights',
      title: 'Aura Knights',
      subtitle: 'The Ultimate Knight Investment',
      content: [
        'Exchange Knights become your permanent core. Each new knight collected increases aura effectiveness across the set, making the whole set more valuable than focusing only one member.',
      ],
      subsections: [
        {
          title: 'Aura Sets',
          content: [
            'Arthurians → Strength aura',
            'Scholars → Leadership aura',
            'Monarchs → Intellect aura',
            'Epic Heroes → Charisma aura',
          ],
        },
      ],
    },
    {
      id: 'progression-stages',
      title: 'Progression Stages',
      subtitle: 'How to Evolve Over Time',
      content: [
        'Your account progression follows distinct phases. Each requires different resource allocation and strategic focus.',
      ],
      subsections: [
        {
          title: 'Stage 1: Days 1-30',
          content: [
            'Objective: Unlock every daily activity, maximize silver production, establish four specialists.',
            'Forget rankings. The whales own the first month. You build the engine.',
          ],
        },
        {
          title: 'Before Aura Knights',
          content: [
            'Strength → strongest lover knight',
            'Leadership → strongest lover knight',
            'Charisma → strongest lover knight',
            'Intellect → Dante',
          ],
        },
        {
          title: 'After Unlocking Aura Knights',
          content: [
            'Transition one specialty at a time. Do NOT switch all four simultaneously.',
            'Keep investing in temporary specialists while slowly building aura knights.',
          ],
        },
      ],
    },
    {
      id: 'university-optimization',
      title: 'University Optimization',
      subtitle: 'Free Talent EXP Every Day',
      content: [
        'Many players waste University seats. Never leave seats empty - it\'s effectively free Talent EXP every day cycle.',
      ],
      subsections: [
        {
          title: 'Ideal Priority Order',
          content: [
            '1. Main Strength Knight',
            '2. Main Intellect Knight',
            '3. Leadership Knight',
            '4. Charisma Knight',
            '5. Future Aura Knights',
            '6. Arena Knight',
            '7. Backup Aura Knight',
          ],
        },
      ],
    },
    {
      id: 'leveling-strategy',
      title: 'Leveling Strategy',
      subtitle: 'Concentration Over Equality',
      content: [
        'Do NOT level everyone equally. Instead, follow typical progression:',
        '• Top knight → 350',
        '• Second → 300',
        '• Third → 250',
        '• Fourth → 250',
        '• Others → minimum required',
      ],
      subsections: [
        {
          title: 'Mid-Game Evolution',
          content: [
            'After silver income becomes huge: Raise secondary permanent knights to 300–350 for additional Knight Power and event performance.',
          ],
        },
      ],
    },
    {
      id: 'exile-strategy',
      title: 'Exile Strategy',
      subtitle: 'Who to Banish',
      content: [
        'Eventually exile: 2-star knights, weak non-specialists, knights with poor talent distributions.',
        'Keep: Aura Knights, Lover Knights, High-star specialists.',
        'Some experienced players even keep permanent low-value knights because they still contribute to total Knight Power and can receive evenly distributed Strength Books.',
      ],
    },
    {
      id: 'lover-optimization',
      title: 'Lover Optimization',
      subtitle: 'Never Spread Evenly',
      content: [
        'Never spread intimacy evenly across multiple lovers. Choose lovers attached to your four main specialists.',
        'Every intimacy point increases returns on future knight investment.',
      ],
      subsections: [
        {
          title: 'Optimal Pattern',
          content: [
            'Never: 50, 50, 50, 50 (spread evenly)',
            'Instead: 300, 300, 300, then 1000+ (concentrate)',
            'Each intimacy breakpoint unlocks stronger lover bonuses.',
            'Charm mostly increases relationship growth, not direct knight power.',
          ],
        },
      ],
    },
    {
      id: 'arena-meta',
      title: 'Arena Meta',
      subtitle: 'Quality Over Quantity',
      content: [
        'Arena is about quality, not quantity. You want:',
        '• One monster Strength knight',
        '• Several solid specialists',
        '• Avoid sending weak filler knights',
        'Arena rewards Talent EXP and Skill EXP, making daily participation valuable even if you aren\'t dominant.',
      ],
      subsections: [
        {
          title: 'Arena Knight Skills',
          content: [
            'Strength specialist: Critical, Attack, HP',
            'Leadership: HP',
            'Intellect: Defense',
            'Charisma: Attack',
          ],
        },
      ],
    },
    {
      id: 'biggest-mistakes',
      title: 'The Biggest Mistakes',
      subtitle: 'What to Avoid',
      content: [
        '1. Leveling every knight',
        '2. Using edicts on 1–4★ talents',
        '3. Ignoring Intellect',
        '4. Spreading lover intimacy',
        '5. Switching to aura knights too early',
        '6. Spending resources outside ranking events',
        '7. Buying random knights instead of completing aura sets',
        '8. Neglecting daily University training',
      ],
    },
    {
      id: 'top-10-rules',
      title: 'The Top 1% Rulebook',
      subtitle: 'Ten Rules That Matter Most',
      content: [
        'If you remember only ten rules, make them these:',
        '1. Never build more than one main knight per attribute',
        '2. Prioritize Intellect early to fuel long-term growth',
        '3. Use edicts only on 5★–6★ talents',
        '4. Use Talent EXP on low-star talents',
        '5. Spread Strength books; concentrate other books on specialists',
        '6. Never spend rare resources outside major ranking events unless progression is blocked',
        '7. Transition to aura knights gradually, not immediately after unlocking them',
        '8. Join the strongest active alliance you can qualify for',
        '9. Keep University training active at all times',
        '10. Think in months, not days—success comes from compound growth',
      ],
    },
    {
      id: 'endgame-strategy',
      title: 'Endgame Strategy',
      subtitle: 'When Your Main Four Are Maxed',
      content: [
        'Once your Arthurian, Monarch, Scholar, and Epic Hero are essentially "finished" (high talents, Diamond promotion, strong aura), your account enters the optimization phase.',
        'This is where many players stall because they keep investing in their main four, even though returns become much smaller.',
      ],
      subsections: [
        {
          title: 'Priority 1: Second Generation Specialists',
          content: [
            'Build another high-quality knight for each attribute instead of pushing mains further.',
            'Arena uses many knights. Chess and Dragon Island reward account depth.',
            'The first 1 million attribute points on a new knight often give better return than pushing existing knight from 15M to 16M.',
          ],
        },
        {
          title: 'Priority 2-10',
          content: [
            '2. Finish Every Aura Set (max all Arthurians, Monarchs, etc.)',
            '3. Increase Overall Knight Power (spread Strength Books)',
            '4. Build an Arena Roster (10–15 strong knights)',
            '5. Optimize Secondary Lovers (high Intimacy)',
            '6. Invest in Secondary Talents (diversify specialists)',
            '7. Prepare for Cross-Server Rankings (massive resource hoarding)',
            '8. Decide "Tall" vs "Wide" Strategy (recommend Wide for most)',
            '9. Resource Priorities Change (aura items, armor, edicts)',
            '10. Maintain Consistency (daily training, participation)',
          ],
        },
      ],
    },
    {
      id: 'alliance-advantage',
      title: 'Alliance Advantage',
      subtitle: 'Multiplying Your Growth',
      content: [
        'A strong alliance can provide months\' worth of progression compared to a weak one.',
        'Join the strongest active alliance you can qualify for.',
      ],
      subsections: [
        {
          title: 'Alliance Technology Priorities',
          content: [
            '1. Knight bonuses',
            '2. University',
            '3. Construction',
            '4. Dragon Island',
            '5. Miscellaneous upgrades',
          ],
        },
        {
          title: 'Dragon Island Strategy',
          content: [
            'Always gather. Fight only for valuable nodes.',
            'Stay active near reset. Teleport strategically.',
            'Alliance organization often matters more than individual power.',
          ],
        },
      ],
    },
  ];

  getActiveSection(): Section | undefined {
    return this.sections.find(s => s.id === this.activeSection);
  }
}
