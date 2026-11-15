import { ContentTab } from '../../../shared/app-tabs/app-tabs.schema';
import { MovesRules } from '../../../shared/moves-calculator/moves-formulas';

export const ReapWhatYouSowTabs: ContentTab[] = [
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

/** Moves refill for the Moves calculator tab. */
export const ReapWhatYouSowMoves: MovesRules = {
  resource: 'stamina',
  max: 28,
  amount: 4,
  everyMinutes: 30,
};
