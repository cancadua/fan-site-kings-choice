import { Component, computed, signal } from '@angular/core';
import { UwCitiesContainer } from './uw-cities-container/uw-cities-container.component';
import { uwCities } from '../../../../core/constants/uw-cities';
import { City } from './uw-cities-container/uw-cities-container.schema';

@Component({
  selector: 'app-uw-cities-tool',
  imports: [UwCitiesContainer],
  templateUrl: './uw-cities-tool.component.html',
  styleUrl: './uw-cities-tool.component.scss',
})
export class UwCitiesToolComponent {
  position: any = [];
  counter = 0;

  isMobile = signal(false);

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile.set(window.innerWidth <= 600);
  }

  nonEmpty = signal<City[]>(
    Object.entries(uwCities)
      .reduce((acc: City[], [key, value]) => {
        if (value.length > 0) {
          acc.push(...value.map((city) => ({ ...city })));
        }
        return acc;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  empty = signal<City[]>([]);

  full = computed(() => {
    return [...this.nonEmpty(), ...this.empty()];
  });

  asd(a: any) {
    this.position.push({
      left: ((a.layerX / 1024) * 100).toString() + '%',
      top: ((a.layerY / 826) * 100).toString() + '%',
    });
    this.counter++;
    console.log(this.position);
  }
}
