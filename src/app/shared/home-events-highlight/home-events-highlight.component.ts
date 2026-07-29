import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-events-highlight',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-events-highlight.component.html',
  styleUrls: ['./home-events-highlight.component.scss'],
})
export class HomeEventsHighlightComponent {}
