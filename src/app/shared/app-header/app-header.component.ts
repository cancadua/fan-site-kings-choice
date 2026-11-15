import { Component, afterNextRender, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { KOFI_URL } from '../../core/constants/links';
import { SiteSearch } from '../../core/search/site-search.service';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AppIconComponent,
    CommandPaletteComponent,
  ],
  host: { '(document:keydown)': 'onGlobalKeydown($event)' },
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
  private readonly analytics = inject(AnalyticsService);

  menuOpen = signal(false);

  protected readonly search = inject(SiteSearch);

  constructor() {
    afterNextRender(() => this.search.detectPlatform());
  }

  protected openSearch(): void {
    this.closeMenu();
    this.search.open();
  }

  /** Ctrl+K / ⌘K anywhere, or "/" when not typing, opens the search. */
  protected onGlobalKeydown(event: KeyboardEvent): void {
    const shortcut =
      (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) ||
      (event.key === '/' && !this.isTyping(event.target));
    if (!shortcut) return;
    event.preventDefault();
    this.openSearch();
  }

  private isTyping(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    );
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  onKofiClick(): void {
    this.analytics.track('kofi-click', { place: 'header' });
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
