import { ContentTab } from '../../../shared/app-tabs/app-tabs.schema';
import { MovesRules } from '../../../shared/moves-calculator/moves-formulas';

export const RealmRevivalTabs: ContentTab[] = [
  {
    label: 'Basic Information',
    value: 'basic-information',
  },
  {
    label: 'Smart play',
    value: 'smart-play',
  },
  {
    label: 'Moves calculator',
    value: 'moves-calculator',
  },
];

/** Dice refill for the Moves calculator tab (you start the event with 20). */
export const RealmRevivalMoves: MovesRules = {
  resource: 'dice',
  max: 32,
  amount: 4,
  everyMinutes: 30,
};
