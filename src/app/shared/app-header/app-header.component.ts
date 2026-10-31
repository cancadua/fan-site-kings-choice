import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KOFI_URL } from '../../core/constants/links';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class AppHeaderComponent {
  title = "KC Lord's Tavern";
  subtitle = 'A Journey Through the Medieval Era';
  navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Knights', route: '/knight-development' },
    { label: 'Events', route: '/events' },
    { label: 'Alliance', route: '/alliance' },
  ];

  kofiUrl = KOFI_URL;

  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  getIcon(label: string): string {
    const iconMap: Record<string, string> = {
      Home: '🏠',
      Knights: '⚔️',
      Events: '📅',
      Alliance: '🛡️',
    };
    return iconMap[label] || '→';
  }
}
