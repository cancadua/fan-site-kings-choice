import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../core/enums/events';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { ReapWhatYouSowComponent } from './reap-what-you-sow/reap-what-you-sow.component';

interface EventDetail {
  id: Event;
  title: string;
  subtitle: string;
  description: string;
  component?: any;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule, UnchartedWatersComponent, ReapWhatYouSowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit, AfterViewInit {
  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  constructor(private readonly route: ActivatedRoute) {}

  activeEvent: Event = Event.UnchartedWaters;
  readonly Event = Event;

  events: EventDetail[] = [
    {
      id: Event.UnchartedWaters,
      title: 'Uncharted Waters',
      subtitle: 'Trade & Plunder Event',
      description: 'Explore distant cities to discover valuable resources and rare trade goods. Use the city selection tool to find the best cities for your strategy.',
      component: UnchartedWatersComponent,
    },
    {
      id: Event.ReapWhatYouSow,
      title: 'Reap What You Sow',
      subtitle: '',
      description: '',
      component: ReapWhatYouSowComponent,
    },
  ];

  ngOnInit(): void {
    const requestedEvent = this.route.snapshot.queryParamMap.get('event');
    if (requestedEvent && this.events.some(e => e.id === requestedEvent)) {
      this.activeEvent = requestedEvent as Event;
    }
  }

  ngAfterViewInit(): void {
    this.scrollToActiveButton();
  }

  selectEvent(eventId: Event): void {
    this.activeEvent = eventId;
    setTimeout(() => this.scrollToActiveButton(), 0);
  }

  private scrollToActiveButton(): void {
    if (!this.navContainer) return;

    const nav = this.navContainer.nativeElement;
    const activeButton = nav.querySelector('.events-nav-link.active') as HTMLElement;

    if (!activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const scrollAmount = buttonRect.left - navRect.left - (navRect.width / 2) + (buttonRect.width / 2);

    nav.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }

  getActiveEvent(): EventDetail | undefined {
    return this.events.find(e => e.id === this.activeEvent);
  }
}
