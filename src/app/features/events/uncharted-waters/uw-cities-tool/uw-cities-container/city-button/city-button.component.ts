import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../uw-cities-container.schema';

@Component({
  selector: 'app-city-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-button.component.html',
  styleUrls: ['./city-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityButtonComponent {
  @Input() city!: City;
  @Input() nonEmpty = false;

  @Output() move = new EventEmitter<void>();
}
