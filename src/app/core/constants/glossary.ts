import { Event } from '../enums/events';

export interface GlossaryEntry {
  term: string;
  definition: string;
  /** Event whose guide explains the term; search results link there. */
  event: Event;
}

/**
 * Game terms explained in a popover wherever a guide marks them with
 * <app-term key="…">. Definitions only restate what the guides already say.
 */
export const GLOSSARY = {
  'voyagers-coins': {
    term: "Voyager's Coins",
    definition:
      'The Uncharted Waters currency. You start with an amount based on your title level and grow it by trading; it counts towards achievements and ranking rewards.',
    event: Event.UnchartedWaters,
  },
  stamina: {
    term: 'Stamina',
    definition:
      'Spent on exploring: each exploration costs 1. It caps at 28 (+4 every 30 min) in Reap What You Sow and at 40 (+1 every 6 min) in School of Athens; refills above the cap are wasted.',
    event: Event.ReapWhatYouSow,
  },
  'total-talents': {
    term: 'Total Talents',
    definition:
      "The sum of a knight's talents. In Reap What You Sow it is the only stat that counts, both for delegation EXP and for crop battles.",
    event: Event.ReapWhatYouSow,
  },
  'exploration-level': {
    term: 'Exploration Level',
    definition:
      'Raises the chance of higher-rarity crops. It grows by exploring and by delegating up to 4 knights (up to +20% EXP).',
    event: Event.ReapWhatYouSow,
  },
  'alliance-goals': {
    term: 'Alliance Goals',
    definition:
      "Shared targets the whole alliance completes during Struggle for Supremacy. Leaders can see each member's contribution.",
    event: Event.StruggleForSupremacy,
  },
  'individual-milestones': {
    term: 'Individual Milestones',
    definition:
      'Personal progress rewards in Struggle for Supremacy, earned alongside the alliance results.',
    event: Event.StruggleForSupremacy,
  },
  'stage-rankings': {
    term: 'Stage Rankings',
    definition:
      'Rankings for the separate events that make up the 4-week Struggle for Supremacy season.',
    event: Event.StruggleForSupremacy,
  },
  'peak-ranking': {
    term: 'Peak Ranking',
    definition:
      'The overall individual ranking of the whole Struggle for Supremacy season. Usually only a few strong players should chase it.',
    event: Event.StruggleForSupremacy,
  },
  certificates: {
    term: 'Certificates',
    definition:
      'Count towards your team ranking in School of Athens. You earn them by reaching Floor 3 and defeating players, and lose them when someone defeats you.',
    event: Event.SchoolOfAthens,
  },
  'debate-score': {
    term: 'Debate Score',
    definition:
      'Your attack strength in School of Athens, based on total Knight Power. Gold can raise it until the end of the day.',
    event: Event.SchoolOfAthens,
  },
  energy: {
    term: 'Energy',
    definition:
      'Spent to place NPCs in Siege of the Undead: 100 per NPC. It recovers over time up to 1680.',
    event: Event.SiegeOfTheUndead,
  },
  funds: {
    term: 'Funds',
    definition:
      'The Realm Revival event currency: villages produce it, investments cost it and raids steal it. It is not your main-game Gold.',
    event: Event.RealmRevival,
  },
  leadership: {
    term: 'Leadership',
    definition:
      'A knight attribute that raises HP and battle stats in Realm Revival.',
    event: Event.RealmRevival,
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryKey = keyof typeof GLOSSARY;
