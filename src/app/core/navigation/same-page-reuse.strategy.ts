import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
} from '@angular/router';

/** Route data key: routes with the same value show the same page. */
export const SAME_PAGE = 'samePage';

/**
 * `events/:event` and `events/:event/:tab` are separate routes for the same page.
 * Moving between them (switching tabs) keeps the page component instead of
 * recreating it, just like moving between two events does.
 */
@Injectable()
export class SamePageReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.routeConfig === curr.routeConfig) return true;
    const page: unknown = future.data[SAME_PAGE];
    return page !== undefined && page === curr.data[SAME_PAGE];
  }
}
