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
}

export interface NavHubItem<T extends string = string> {
  id: T;
  title: string;
  subtitle?: string;
  icon?: IconName;
  facts?: NavHubFact[];
  banner?: NavHubBanner;
  /** ISO date (yyyy-mm-dd) the content was last checked against the game. */
  reviewed?: string;
}
