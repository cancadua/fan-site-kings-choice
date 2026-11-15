import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Good {
  name: string;
  baseCost: number;
  weight: number;
}

/** Base prices and weights from a community table. */
const GOODS: Good[] = [
  { name: 'Agate', baseCost: 1000, weight: 100 },
  { name: 'Alcohol', baseCost: 847, weight: 65 },
  { name: 'Banana', baseCost: 50, weight: 4 },
  { name: 'Carpets', baseCost: 397, weight: 30 },
  { name: 'Cloth', baseCost: 250, weight: 22 },
  { name: 'Diamonds', baseCost: 1196, weight: 80 },
  { name: 'Dye', baseCost: 299, weight: 20 },
  { name: 'Firearms', baseCost: 1103, weight: 100 },
  { name: 'Fish', baseCost: 70, weight: 5 },
  { name: 'Gold', baseCost: 896, weight: 75 },
  { name: 'Leather', baseCost: 206, weight: 16 },
  { name: 'Meat', baseCost: 90, weight: 6 },
  { name: 'Medicine', baseCost: 160, weight: 11 },
  { name: 'Paper', baseCost: 132, weight: 10 },
  { name: 'Peanuts', baseCost: 110, weight: 10 },
  { name: 'Pearls', baseCost: 728, weight: 68 },
  { name: 'Porcelain', baseCost: 798, weight: 57 },
  { name: 'Tea leaves', baseCost: 451, weight: 37 },
  { name: 'Tin', baseCost: 350, weight: 25 },
  { name: 'Tobacco', baseCost: 525, weight: 50 },
];

/** Goods at or above this value per weight are marked as the best cargo. */
const BEST_VALUE = 14.5;

/**
 * Uncharted Waters goods sorted by value per unit of weight. The hold is
 * limited by weight, so denser goods earn more from a full hold.
 */
@Component({
  selector: 'app-uw-goods-table',
  standalone: true,
  template: `
    <div class="table-wrap" tabindex="0" role="region" aria-label="Goods">
      <table class="goods">
        <thead>
          <tr>
            <th scope="col">Good</th>
            <th scope="col">Base cost</th>
            <th scope="col">Weight</th>
            <th scope="col">Value / weight</th>
          </tr>
        </thead>
        <tbody>
          @for (good of goods; track good.name) {
            <tr [class.goods__best]="good.value >= best">
              <th scope="row">{{ good.name }}</th>
              <td>{{ good.baseCost }}</td>
              <td>{{ good.weight }}</td>
              <td class="goods__value">{{ good.value.toFixed(1) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './uw-goods-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UwGoodsTableComponent {
  protected readonly best = BEST_VALUE;
  protected readonly goods = GOODS.map((good) => ({
    ...good,
    value: good.baseCost / good.weight,
  })).sort((a, b) => b.value - a.value);
}
