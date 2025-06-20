import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [RouterLink]
})
export class AppHeaderComponent {
  title = "King's Choice Fan Site";
  subtitle = "A Journey Through the Medieval Era";
  navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Knights', route: '/knights' },
    { label: 'Events', route: '/events' }
  ];
}
