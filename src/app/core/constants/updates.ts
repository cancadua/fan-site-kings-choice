import { Event } from '../enums/events';

export interface SiteUpdate {
  /** Changing the id shows the banner again to people who dismissed the previous one. */
  id: string;
  text: string;
  route: string;
  queryParams?: Record<string, string>;
}

export const LATEST_UPDATE: SiteUpdate = {
  id: 'siege-of-the-undead',
  text: 'New event guide: Siege of the Undead',
  route: `/events/${Event.SiegeOfTheUndead}`,
};
