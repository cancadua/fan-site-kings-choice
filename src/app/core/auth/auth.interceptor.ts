import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SessionService } from './session.service';

const AUTH_PATHS = ['/api/auth/login', '/api/auth/register'];

/** Adds the bearer token to API calls and signs the user out when the API rejects it. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  const session = inject(SessionService);
  const router = inject(Router);

  const token = session.token();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: unknown) => {
      const isAuthCall = AUTH_PATHS.some(path => req.url.endsWith(path));
      if (err instanceof HttpErrorResponse && err.status === 401 && !isAuthCall) {
        session.clear();
        void router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
