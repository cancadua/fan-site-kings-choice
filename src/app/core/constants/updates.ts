import { Event } from '../enums/events';

export interface SiteUpdate {
  /** Changing the id shows the banner again to people who dismissed the previous one. */
  id: string;
  text: string;
  route: string;
  queryParams?: Record<string, string>;
}

export const LATEST_UPDATE: SiteUpdate = {
  id: 'realm-revival',
  text: 'New event guide: Realm Revival',
  route: `/events/${Event.RealmRevival}`,
};
