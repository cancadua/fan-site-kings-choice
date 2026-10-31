import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiStatusService } from './api-status.service';

/** A request pending longer than this is reported as the server waking up. */
const SLOW_AFTER_MS = 3000;
/** Free hosting can take up to a minute to cold start; give up after this. */
const TIMEOUT_MS = 60000;

/** Flags slow API calls and fails calls that never answer. */
export const apiStatusInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  const status = inject(ApiStatusService);

  return new Observable((subscriber) => {
    let slow = false;
    const timer = setTimeout(() => {
      slow = true;
      status.markSlow();
    }, SLOW_AFTER_MS);

    const subscription = next(req)
      .pipe(
        timeout(TIMEOUT_MS),
        finalize(() => {
          clearTimeout(timer);
          if (slow) status.markDone();
        })
      )
      .subscribe(subscriber);

    return () => subscription.unsubscribe();
  });
};
