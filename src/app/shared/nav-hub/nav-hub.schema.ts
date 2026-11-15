import { IconName } from '../app-icon/icons';

/** One at-a-glance fact shown in the strip under an article title. */
export interface NavHubFact {
  icon: IconName;
  label: string;
  value: string;
}

/** Artwork shown behind the article title. Width/height reserve its space. */
export interface NavHubBanner {
  src: string;
  width: number;
  height: number;
  /** Image for link previews (Discord, Facebook…); defaults to `src`. Best at 1200×630. */
  og?: { src: string; width: number; height: number };
  /** Small copy (640 px wide) for cards, so lists don't load full-size art. */
  card?: string;
}

export interface NavHubItem<T extends string = string> {
  id: T;
  title: string;
  subtitle?: string;
  icon?: IconName;
  facts?: NavHubFact[];
  banner?: NavHubBanner;
  /** Short labels shown as pills on the title plaque and cards, e.g. event variants. */
  tags?: string[];
  /** ISO date (yyyy-mm-dd) the content was last checked against the game. */
  reviewed?: string;
}
