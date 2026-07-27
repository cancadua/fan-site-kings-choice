import { Event } from '../enums/events';

type EventData = Record<string, string> & {
  name: string;
  value: string;
  image: string;
};

export const EventsData: Array<EventData> = [
  {
    name: 'Uncharted Waters',
    value: Event.UnchartedWaters,
    image: 'assets/uncharted-waters.jpg',
  },
  {
    name: 'School of Athens',
    value: Event.SchoolOfAthens,
    image: '',
  },
  {
    name: 'Scarlet Beauty',
    value: Event.ScarletBeauty,
    image: '',
  },
  {
    name: 'War of the Lions',
    value: Event.WarOfTheLions,
    image: '',
  },
  {
    name: 'Knight Encounter',
    value: Event.KnightEncounter,
    image: '',
  },
  {
    name: 'Pet Race',
    value: Event.PetRace,
    image: '',
  },
  {
    name: 'Throne of the Wolves',
    value: Event.ThroneOfTheWolves,
    image: '',
  },
  {
    name: 'Dragon Island',
    value: Event.DragonIsland,
    image: '',
  },
];
