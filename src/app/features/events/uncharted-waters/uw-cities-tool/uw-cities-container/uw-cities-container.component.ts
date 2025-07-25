import { Component, model, signal } from '@angular/core';
import { CityButtonComponent } from './city-button/city-button.component';
import { CommonModule } from '@angular/common';
import { uwCities } from '../../../../../core/constants/uw-cities';
import { City } from './uw-cities-container.schema';

@Component({
  selector: 'app-uw-cities-container',
  templateUrl: './uw-cities-container.component.html',
  styleUrls: ['./uw-cities-container.component.scss'],
  imports: [CityButtonComponent, CommonModule],
})
export class UwCitiesContainer {
  nonEmpty = model<City[]>([]);

  empty = model<City[]>([]);

  dragData: { city: City; from: 'A' | 'B'; index: number } | null = null;

  onDragStart(city: City, from: 'A' | 'B', index: number, event: DragEvent) {
    this.dragData = { city, from, index };
    event.dataTransfer?.setData('text/plain', JSON.stringify({}));
  }

  moveCity(city: City, from: 'A' | 'B') {
    if (from === 'A') {
      const idx = this.nonEmpty().findIndex((c) => c === city);
      if (idx > -1) {
        const newNonEmpty = [...this.nonEmpty()];
        const newEmpty = [...this.empty()];
        newNonEmpty.splice(idx, 1);
        city.color = 'red'; // Set color to red when moved to empty
        newEmpty.push(city);
        this.nonEmpty.set(newNonEmpty);
        this.empty.set(newEmpty);
      }
    } else {
      const idx = this.empty().findIndex((c) => c === city);
      if (idx > -1) {
        const newEmpty = [...this.empty()];
        const newNonEmpty = [...this.nonEmpty()];
        newEmpty.splice(idx, 1);
        city.color = 'green'; // Set color to green when moved to nonEmpty
        newNonEmpty.push(city);
        this.empty.set(newEmpty);
        this.nonEmpty.set(newNonEmpty);
      }
    }
  }

  onDrop(to: 'A' | 'B', index: number | null) {
    if (!this.dragData) return;
    const { city, from, index: fromIndex } = this.dragData;

    // Remove from original space
    if (from === 'A') {
      const newNonEmpty = [...this.nonEmpty()];
      newNonEmpty.splice(fromIndex, 1);
      this.nonEmpty.set(newNonEmpty);
    } else {
      const newEmpty = [...this.empty()];
      newEmpty.splice(fromIndex, 1);
      this.empty.set(newEmpty);
    }

    // Insert into new space at the correct position
    if (to === 'A') {
      const newNonEmpty = [...this.nonEmpty()];
      city.color = 'green'; // Set color to green when added to nonEmpty
      if (index === null) newNonEmpty.push(city);
      else newNonEmpty.splice(index, 0, city);
      this.nonEmpty.set(newNonEmpty);
    } else {
      const newEmpty = [...this.empty()];
      city.color = 'red'; // Set color to red when added to empty
      if (index === null) newEmpty.push(city);
      else newEmpty.splice(index, 0, city);
      this.empty.set(newEmpty);
    }

    this.dragData = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
