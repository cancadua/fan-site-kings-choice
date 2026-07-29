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
    name: 'Reap What You Sow',
    value: Event.ReapWhatYouSow,
    image: '',
  },
];
