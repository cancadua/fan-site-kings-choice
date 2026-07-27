import { Component } from '@angular/core';
import { AppDropComponent } from '../../shared/app-drop/app-drop.component';
import { EventsData } from '../../core/constants/events-data';
import { Event } from '../../core/enums/events';
import { UnchartedWatersComponent } from './uncharted-waters/uncharted-waters.component';
import { SchoolOfAthensComponent } from './school-of-athens/school-of-athens.component';
import { ScarletBeautyComponent } from './scarlet-beauty/scarlet-beauty.component';
import { WarOfTheLionsComponent } from './war-of-the-lions/war-of-the-lions.component';
import { KnightEncounterComponent } from './knight-encounter/knight-encounter.component';
import { PetRaceComponent } from './pet-race/pet-race.component';
import { ThroneOfTheWolvesComponent } from './throne-of-the-wolves/throne-of-the-wolves.component';
import { DragonIslandComponent } from './dragon-island/dragon-island.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports: [
    AppDropComponent,
    UnchartedWatersComponent,
    SchoolOfAthensComponent,
    ScarletBeautyComponent,
    WarOfTheLionsComponent,
    KnightEncounterComponent,
    PetRaceComponent,
    ThroneOfTheWolvesComponent,
    DragonIslandComponent,
  ],
})
export class EventsComponent {
  protected readonly eventsData: Array<Record<string, string>> = EventsData;

  protected readonly Event = Event;

  selectedEvent: Event | null = null;
}
