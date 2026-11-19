import { Event } from '../../core/enums/events';
import { ContentTab } from '../../shared/app-tabs/app-tabs.schema';
import { RealmRevivalTabs } from './realm-revival/realm-revival.schema';
import { ReapWhatYouSowTabs } from './reap-what-you-sow/reap-what-you-sow.schema';
import { SchoolOfAthensTabs } from './school-of-athens/school-of-athens.schema';
import { SiegeOfTheUndeadTabs } from './siege-of-the-undead/siege-of-the-undead.schema';
import { StruggleForSupremacyTabs } from './struggle-for-supremacy/struggle-for-supremacy.schema';
import { UnchartedWaterTabs } from './uncharted-waters/uncharted-waters.schema';

/** Tabs of every event guide, used for its URLs, prerendering, page titles and search. */
export const EVENT_TABS: Record<Event, ContentTab[]> = {
  [Event.UnchartedWaters]: UnchartedWaterTabs,
  [Event.ReapWhatYouSow]: ReapWhatYouSowTabs,
  [Event.StruggleForSupremacy]: StruggleForSupremacyTabs,
  [Event.SchoolOfAthens]: SchoolOfAthensTabs,
  [Event.SiegeOfTheUndead]: SiegeOfTheUndeadTabs,
  [Event.RealmRevival]: RealmRevivalTabs,
};

/** URL of an event guide (its default tab). */
export const eventPath = (event: Event): string => `/events/${event}`;
