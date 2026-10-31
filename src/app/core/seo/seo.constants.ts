import { Event } from '../enums/events';

export const SITE_URL = 'https://kc-lords-tavern.com';
export const SITE_NAME = "KC Lord's Tavern";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SeoPage {
  /** Short page title; the site name is appended automatically. */
  title: string;
  description: string;
  /** Path without query string, e.g. `/events/school-of-athens`. */
  path: string;
  /** Keep the page out of search results (private tools). */
  noindex?: boolean;
  /** Crumbs after Home, used for the BreadcrumbList structured data. */
  breadcrumbs?: { name: string; path: string }[];
}

export const DEFAULT_DESCRIPTION =
  "Free fan-made guides and tools for King's Choice players: event guides, the Uncharted Waters city planner and knight development tips.";

export const PAGE_SEO = {
  home: {
    title: "King's Choice Guides & Tools",
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  events: {
    title: "King's Choice Event Guides",
    description:
      "Guides for King's Choice events: Uncharted Waters, Reap What You Sow, Struggle for Supremacy, School of Athens and Siege of the Undead.",
    path: '/events/uncharted-waters',
  },
  knights: {
    title: "King's Choice Knight Development Guide",
    description:
      "Advanced King's Choice knight development: how the mechanics work, optimization and competitive strategies for serious players.",
    path: '/knight-development',
  },
  guide: {
    title: "King's Choice Guide & Tips",
    description:
      "Guides and tips for King's Choice players: progression, Lord Level and getting the most from your resources.",
    path: '/guide',
  },
  privacy: {
    title: 'Privacy',
    description:
      "How KC Lord's Tavern handles visitor statistics, accounts and shared maps.",
    path: '/privacy',
  },
  login: {
    title: 'Alliance Management',
    description: 'Sign in to manage your alliance.',
    path: '/login',
    noindex: true,
  },
  alliance: {
    title: 'Alliance Management',
    description: 'Private notebook for alliance leaders.',
    path: '/alliance',
    noindex: true,
  },
} satisfies Record<string, SeoPage>;

export const EVENT_SEO: Record<Event, { title: string; description: string }> =
  {
    [Event.UnchartedWaters]: {
      title: 'Uncharted Waters Event Guide & City Planner',
      description:
        "Plan your King's Choice Uncharted Waters event with the interactive map, the city selection tool and shareable plans for your alliance.",
    },
    [Event.ReapWhatYouSow]: {
      title: 'Reap What You Sow Event Guide',
      description:
        "King's Choice Reap What You Sow (Flora & Fauna) event: guide and tips.",
    },
    [Event.StruggleForSupremacy]: {
      title: 'Struggle for Supremacy Event Guide',
      description:
        "King's Choice Struggle for Supremacy alliance season event: guide and tips.",
    },
    [Event.SchoolOfAthens]: {
      title: 'School of Athens Event Guide',
      description:
        "King's Choice School of Athens 3-player team event: the three floors, Debate Points and tips for your team.",
    },
    [Event.SiegeOfTheUndead]: {
      title: 'Siege of the Undead Event Guide',
      description:
        "King's Choice Siege of the Undead alliance defense event: guide and tips.",
    },
  };
