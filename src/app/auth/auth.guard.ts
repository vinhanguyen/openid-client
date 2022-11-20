import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { authenticate } from './auth.actions';
import { selectToken } from './auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectToken).pipe(
      tap(token => {
        if (!token) {
          this.store.dispatch(authenticate({url: state.url}));
        }
      }),
      map(token => token ? true : false)
    );
  }

  constructor(private store: Store) {}
  
}
