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

  nonEmpty = signal<City[]>(
    Object.entries(uwCities).reduce((acc: City[], [key, value]) => {
      if (value.length > 0) {
        acc.push(...value.map((city) => ({ ...city })));
      }
      return acc;
    }, [])
  );

  empty = signal<City[]>([]);

  mapExpanded = signal(false);

  full = computed(() => {
    return [...this.nonEmpty(), ...this.empty()];
  });

  toggleMap(): void {
    this.mapExpanded.update((expanded) => !expanded);
  }

  isPopulated(city: City): boolean {
    return this.nonEmpty().includes(city);
  }

  logClickPosition(event: MouseEvent) {
    const mapEl = event.currentTarget as HTMLElement;
    const rect = mapEl.getBoundingClientRect();
    this.position.push({
      left: (((event.clientX - rect.left) / rect.width) * 100).toString() + '%',
      top: (((event.clientY - rect.top) / rect.height) * 100).toString() + '%',
    });
    this.counter++;
    console.log(this.position);
  }
}
