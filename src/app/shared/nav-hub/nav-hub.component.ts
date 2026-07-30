import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHubItem } from './nav-hub.schema';

@Component({
  selector: 'app-nav-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-hub.component.html',
  styleUrls: ['./nav-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHubComponent<T extends string = string> implements AfterViewInit {
  private readonly navContainer = viewChild<ElementRef<HTMLElement>>('navContainer');

  title = input.required<string>();
  subtitle = input('');
  navLabel = input('Sections');
  items = input.required<NavHubItem<T>[]>();
  activeId = model.required<T>();

  ngAfterViewInit(): void {
    this.scrollToActiveButton();
  }

  get activeItem(): NavHubItem<T> | undefined {
    return this.items().find(item => item.id === this.activeId());
  }

  selectItem(id: T): void {
    this.activeId.set(id);
    setTimeout(() => this.scrollToActiveButton(), 0);
  }

  private scrollToActiveButton(): void {
    const nav = this.navContainer()?.nativeElement;
    if (!nav) return;

    const activeButton = nav.querySelector('.nav-hub-link.active') as HTMLElement;
    if (!activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const scrollAmount = buttonRect.left - navRect.left - navRect.width / 2 + buttonRect.width / 2;

    nav.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
