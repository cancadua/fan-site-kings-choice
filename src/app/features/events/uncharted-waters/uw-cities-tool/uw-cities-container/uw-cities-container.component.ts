import { Component, model, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CityButtonComponent } from './city-button/city-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { uwCities } from '../../../../../core/constants/uw-cities';
import { City } from './uw-cities-container.schema';

@Component({
  selector: 'app-uw-cities-container',
  standalone: true,
  templateUrl: './uw-cities-container.component.html',
  styleUrls: ['./uw-cities-container.component.scss'],
  imports: [CityButtonComponent, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UwCitiesContainer {
  nonEmpty = model<City[]>([]);

  empty = model<City[]>([]);

  searchQuery = signal<string>('');

  dragData: { city: City; from: 'A' | 'B'; index: number } | null = null;

  filteredNonEmpty = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.nonEmpty();
    const queries = query.split(',').map(q => q.trim()).filter(q => q);
    return this.nonEmpty().filter((city) =>
      this.matchesAnySearch(city.name.toLowerCase(), queries)
    );
  });

  filteredEmpty = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.empty();
    const queries = query.split(',').map(q => q.trim()).filter(q => q);
    return this.empty().filter((city) =>
      this.matchesAnySearch(city.name.toLowerCase(), queries)
    );
  });

  private matchesAnySearch(cityName: string, queries: string[]): boolean {
    return queries.some(query => this.matchesSearch(cityName, query));
  }

  private matchesSearch(cityName: string, query: string): boolean {
    if (cityName.includes(query)) return true;
    return this.fuzzyMatch(cityName, query);
  }

  private fuzzyMatch(str: string, pattern: string): boolean {
    if (pattern.length > str.length) return false;
    if (pattern.length === 0) return true;

    let strIdx = 0;
    let patIdx = 0;
    let mismatchCount = 0;

    while (strIdx < str.length && patIdx < pattern.length) {
      if (str[strIdx] === pattern[patIdx]) {
        patIdx++;
      } else {
        mismatchCount++;
        if (mismatchCount > 1) return false;
      }
      strIdx++;
    }

    return patIdx === pattern.length;
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.moveFilteredLastCity();
    }
  }

  onSearchBlur(): void {
    this.moveFilteredLastCity();
  }

  protected moveFilteredLastCity(): void {
    const filteredNonEmptyList = this.filteredNonEmpty();
    const filteredEmptyList = this.filteredEmpty();
    const hasMultipleQueries = this.searchQuery().includes(',');

    if (filteredNonEmptyList.length > 0 && filteredEmptyList.length === 0) {
      if (filteredNonEmptyList.length === 1 || hasMultipleQueries) {
        this.moveAllFiltered(filteredNonEmptyList, 'A');
      }
    } else if (filteredEmptyList.length > 0 && filteredNonEmptyList.length === 0) {
      if (filteredEmptyList.length === 1 || hasMultipleQueries) {
        this.moveAllFiltered(filteredEmptyList, 'B');
      }
    }
  }

  private moveAllFiltered(citiesToMove: City[], from: 'A' | 'B'): void {
    if (from === 'A') {
      const newNonEmpty = [...this.nonEmpty()];
      const newEmpty = [...this.empty()];
      citiesToMove.forEach(city => {
        const idx = newNonEmpty.findIndex((c) => c === city);
        if (idx > -1) {
          newNonEmpty.splice(idx, 1);
          city.color = 'red';
          newEmpty.push(city);
        }
      });
      this.nonEmpty.set(newNonEmpty);
      this.empty.set(newEmpty);
      this.searchQuery.set('');
    } else {
      const newEmpty = [...this.empty()];
      const newNonEmpty = [...this.nonEmpty()];
      citiesToMove.forEach(city => {
        const idx = newEmpty.findIndex((c) => c === city);
        if (idx > -1) {
          newEmpty.splice(idx, 1);
          city.color = 'green';
          newNonEmpty.push(city);
        }
      });
      this.empty.set(newEmpty);
      this.nonEmpty.set(newNonEmpty);
      this.searchQuery.set('');
    }
  }

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
        city.color = 'red';
        newEmpty.push(city);
        this.nonEmpty.set(newNonEmpty);
        this.empty.set(newEmpty);
        this.autoMoveIfLastCity('A');
      }
    } else {
      const idx = this.empty().findIndex((c) => c === city);
      if (idx > -1) {
        const newEmpty = [...this.empty()];
        const newNonEmpty = [...this.nonEmpty()];
        newEmpty.splice(idx, 1);
        city.color = 'green';
        newNonEmpty.push(city);
        this.empty.set(newEmpty);
        this.nonEmpty.set(newNonEmpty);
        this.autoMoveIfLastCity('B');
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
      city.color = 'green';
      if (index === null) newNonEmpty.push(city);
      else newNonEmpty.splice(index, 0, city);
      this.nonEmpty.set(newNonEmpty);
    } else {
      const newEmpty = [...this.empty()];
      city.color = 'red';
      if (index === null) newEmpty.push(city);
      else newEmpty.splice(index, 0, city);
      this.empty.set(newEmpty);
    }

    this.dragData = null;
    this.autoMoveIfLastCity('A');
    this.autoMoveIfLastCity('B');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private autoMoveIfLastCity(from: 'A' | 'B'): void {
    if (from === 'A' && this.nonEmpty().length === 1) {
      const city = this.nonEmpty()[0];
      const newNonEmpty: City[] = [];
      const newEmpty = [...this.empty()];
      city.color = 'red';
      newEmpty.push(city);
      this.nonEmpty.set(newNonEmpty);
      this.empty.set(newEmpty);
    } else if (from === 'B' && this.empty().length === 1) {
      const city = this.empty()[0];
      const newEmpty: City[] = [];
      const newNonEmpty = [...this.nonEmpty()];
      city.color = 'green';
      newNonEmpty.push(city);
      this.empty.set(newEmpty);
      this.nonEmpty.set(newNonEmpty);
    }
  }
}
