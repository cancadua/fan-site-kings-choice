import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for the home page
  { path: 'events', component: EventsComponent } // Add route for /events
];
