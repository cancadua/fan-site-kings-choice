import { ContentTab } from '../../../shared/app-tabs/app-tabs.schema';
import { MovesRules } from '../../../shared/moves-calculator/moves-formulas';

export const UnchartedWaterTabs: ContentTab[] = [
  {
    label: 'Basic Information',
    value: 'basic-information',
  },
  {
    label: 'Smart play',
    value: 'smart-play',
  },
  {
    label: 'Advanced Tips',
    value: 'advanced-tips',
    hidden: true,
  },
  {
    label: 'Cities Tool',
    value: 'cities-tool',
  },
  {
    label: 'Moves calculator',
    value: 'moves-calculator',
  },
];

/** Moves refill for the Moves calculator tab. */
export const UnchartedWatersMoves: MovesRules = {
  resource: 'moves',
  max: 10,
  amount: 1,
  everyMinutes: 30,
};
