import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeEventsHighlightComponent } from '../../shared/home-events-highlight/home-events-highlight.component';
import { HomeCtaSectionComponent } from '../../shared/home-cta-section/home-cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeEventsHighlightComponent,
    HomeCtaSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
