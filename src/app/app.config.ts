import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { apiStatusInterceptor } from './core/api/api-status.interceptor';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AnalyticsService } from './core/analytics/analytics.service';
import { provideScrollToTopOnNavigation } from './core/navigation/scroll-to-top';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideScrollToTopOnNavigation(),
    provideAppInitializer(() => inject(AnalyticsService).init()),
    provideHttpClient(
      withInterceptors([apiStatusInterceptor, authInterceptor])
    ),
    // Plain `| date` renders dd.MM.yyyy; timestamps use 'dd.MM.yyyy HH:mm'.
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'dd.MM.yyyy' },
    },
  ],
};
