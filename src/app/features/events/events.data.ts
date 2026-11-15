import { Event } from '../../core/enums/events';
import { NavHubItem } from '../../shared/nav-hub/nav-hub.schema';

/**
 * Sidebar, title plaque and search data for every event.
 *
 * - `facts` repeat figures from each event's Basic Information tab; keep them in sync.
 * - `reviewed` is the date the guide was last checked against the game.
 * - `banner`: artwork lives in `assets/img/events/<event-id>/`: `banner.webp`
 *   (full size, title plaque), `card.webp` (640 px, home page cards) and `og.jpg`
 *   (1200×630, link previews).
 */
export const EVENTS_NAV: NavHubItem<Event>[] = [
  {
    id: Event.UnchartedWaters,
    reviewed: '2026-11-15',
    title: 'Uncharted Waters',
    subtitle: 'Trade & Plunder Event',
    icon: 'compass',
    banner: {
      src: 'assets/img/events/uncharted-waters/banner.webp',
      width: 1672,
      height: 941,
      card: 'assets/img/events/uncharted-waters/card.webp',
      og: {
        src: 'assets/img/events/uncharted-waters/og.jpg',
        width: 1200,
        height: 630,
      },
    },
    facts: [
      { icon: 'shield', label: 'Entry', value: 'Alliance with vouchers' },
      { icon: 'map', label: 'Planner', value: 'Interactive cities map' },
      { icon: 'zap', label: 'Moves', value: 'Max 10 · +1 / 30 min' },
    ],
  },
  {
    id: Event.ReapWhatYouSow,
    reviewed: '2026-10-10',
    title: 'Reap What You Sow',
    subtitle: 'Flora & Fauna Event',
    icon: 'sprout',
    banner: {
      src: 'assets/img/events/reap-what-you-sow/banner.webp',
      width: 1672,
      height: 941,
      card: 'assets/img/events/reap-what-you-sow/card.webp',
      og: {
        src: 'assets/img/events/reap-what-you-sow/og.jpg',
        width: 1200,
        height: 630,
      },
    },
    facts: [
      { icon: 'globe', label: 'Format', value: 'Alliance → Cross-Server' },
      { icon: 'zap', label: 'Stamina', value: 'Max 28 · +4 / 30 min' },
      { icon: 'layers', label: 'Crop rarities', value: '8 tiers' },
    ],
  },
  {
    id: Event.StruggleForSupremacy,
    reviewed: '2026-10-31',
    title: 'Struggle for Supremacy',
    subtitle: 'Alliance Season Event',
    icon: 'crown',
    banner: {
      src: 'assets/img/events/struggle-for-supremacy/banner.webp',
      width: 1920,
      height: 1080,
      card: 'assets/img/events/struggle-for-supremacy/card.webp',
      og: {
        src: 'assets/img/events/struggle-for-supremacy/og.jpg',
        width: 1200,
        height: 630,
      },
    },
    facts: [
      { icon: 'hourglass', label: 'Duration', value: '4 weeks' },
      { icon: 'shield', label: 'Format', value: 'Alliance season' },
      { icon: 'users', label: 'Eligibility', value: 'Top 110 by power' },
    ],
  },
  {
    id: Event.SchoolOfAthens,
    reviewed: '2026-10-31',
    title: 'School of Athens',
    subtitle: '3-Player Team Event',
    icon: 'book',
    banner: {
      src: 'assets/img/events/school-of-athens/banner.webp',
      width: 1672,
      height: 941,
      card: 'assets/img/events/school-of-athens/card.webp',
      og: {
        src: 'assets/img/events/school-of-athens/og.jpg',
        width: 1200,
        height: 630,
      },
    },
    facts: [
      { icon: 'users', label: 'Team', value: '3 players' },
      { icon: 'layers', label: 'Floors', value: '3 · PvP on the top' },
      { icon: 'zap', label: 'Stamina', value: 'Max 40 · +1 / 6 min' },
    ],
  },
  {
    id: Event.SiegeOfTheUndead,
    reviewed: '2026-10-31',
    title: 'Siege of the Undead',
    subtitle: 'Alliance Defense Event',
    icon: 'skull',
    banner: {
      src: 'assets/img/events/siege-of-the-undead/banner.webp',
      width: 1672,
      height: 941,
      card: 'assets/img/events/siege-of-the-undead/card.webp',
      og: {
        src: 'assets/img/events/siege-of-the-undead/og.jpg',
        width: 1200,
        height: 630,
      },
    },
    facts: [
      { icon: 'castle', label: 'Goal', value: 'Defend the gate' },
      { icon: 'zap', label: 'NPC cost', value: '100 energy (max 1680)' },
      { icon: 'clock', label: 'Undead advance', value: 'Every 5 min' },
      { icon: 'levelUp', label: 'NPC max level', value: '20 · skill at 10' },
    ],
  },
];
