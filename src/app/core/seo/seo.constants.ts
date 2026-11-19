import { Event } from '../enums/events';

export const SITE_URL = 'https://kc-lords-tavern.com';
export const SITE_NAME = "KC Lord's Tavern";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Absolute URL of a page. GitHub Pages serves each prerendered page from
 * `<path>/index.html` and redirects `<path>` to `<path>/`, so canonical URLs end
 * with a slash and crawlers land on the page without a redirect.
 */
export function pageUrl(path: string): string {
  return SITE_URL + (path.endsWith('/') ? path : `${path}/`);
}

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
  /** Page-specific link preview image (absolute URL); the site image is used otherwise. */
  image?: { url: string; width: number; height: number };
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
      "Guides for King's Choice events: Uncharted Waters, Reap What You Sow, Struggle for Supremacy, School of Athens, Siege of the Undead, Realm Revival and Spice Road.",
    path: '/events',
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

/**
 * Meta descriptions for event tabs other than Basic Information, built from the
 * event name. Tabs not listed here reuse the event's own description.
 */
export const EVENT_TAB_DESCRIPTIONS: Record<string, (event: string) => string> =
  {
    'smart-play': (event) =>
      `Smart play for the King's Choice ${event} event: a step-by-step strategy checklist and tips to get the most out of it.`,
    'moves-calculator': (event) =>
      `${event} moves calculator for King's Choice: see when your moves refill to the cap, so none go to waste.`,
    'cities-tool': (event) =>
      `Interactive ${event} city planner for King's Choice: sort cities on the map and share the plan with a short link.`,
  };

export const EVENT_SEO: Record<Event, { title: string; description: string }> =
  {
    [Event.UnchartedWaters]: {
      title: 'Uncharted Waters Event Guide & City Planner',
      description:
        "King's Choice Uncharted Waters guide: how prices and ship skills work, the best goods for your hold, an interactive city planner and a moves calculator.",
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
    [Event.RealmRevival]: {
      title: 'Realm Revival Event Guide',
      description:
        "King's Choice Realm Revival alliance ranking event: building economy, raids, cards and combos, tips for your alliance and a dice calculator.",
    },
    [Event.SpiceRoad]: {
      title: 'Spice Road Event Guide',
      description:
        "King's Choice Spice Road ranking event: where points come from, EXP and orders, carriages, raids, Retail Orders and Giant Carriage, plus a smart play checklist.",
    },
  };
