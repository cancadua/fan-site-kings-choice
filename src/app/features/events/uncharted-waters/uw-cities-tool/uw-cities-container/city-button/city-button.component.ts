import { Component, Input, Output, EventEmitter } from '@angular/core';
import { City } from '../uw-cities-container.schema';

@Component({
  selector: 'app-city-button',
  templateUrl: './city-button.component.html',
  styleUrls: ['./city-button.component.scss'],
})
export class CityButtonComponent {
  @Input() city!: City;
  @Input() nonEmpty = false;

  @Output() move = new EventEmitter<void>();
}
