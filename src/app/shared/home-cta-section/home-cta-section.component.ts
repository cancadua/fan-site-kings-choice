import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-cta-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-cta-section.component.html',
  styleUrls: ['./home-cta-section.component.scss'],
})
export class HomeCtaSectionComponent {}
