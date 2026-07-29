import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeEventsHighlightComponent } from '../../shared/home-events-highlight/home-events-highlight.component';
import { HomeCtaSectionComponent } from '../../shared/home-cta-section/home-cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HomeEventsHighlightComponent, HomeCtaSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
