import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concatMap, map, of, tap, withLatestFrom } from "rxjs";
import { selectFragment } from "../router.selectors";
import { authenticate, callback, fail, validToken, nonceCreated, stateRestored, stateSaved } from "./auth.actions";
import { selectAuth, selectNonce, selectUrl } from "./auth.selectors";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthEffects {

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authenticate),
      map((action) => {
        const nonce = this.service.createNonce();
        return nonceCreated({nonce});
      })
    )
  );

  nonceCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nonceCreated),
      concatMap(action => of(action).pipe(
        withLatestFrom(
          this.store.select(selectAuth)
        ),
      )),
      map(([action, state]) => {
        localStorage.setItem('state', JSON.stringify(state));
        return stateSaved();
      })
    )
  );

  stateSaved$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stateSaved),
      concatMap(action => of(action).pipe(
        withLatestFrom(
          this.store.select(selectNonce)
        ),
      )),
      tap(([action, nonce]) => this.service.sendAuthReq(nonce))
    ), {dispatch: false}
  );

  callback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callback),
      map(() => {
        const state = localStorage.getItem('state');
                      localStorage.clear();
        if (state) {
          return stateRestored({auth: JSON.parse(state)});
        }
        return fail({error: 'No state'});
      })
    )
  );

  stateRestored$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stateRestored),
      concatMap(action => of(action).pipe(
        withLatestFrom(
          this.store.select(selectNonce),
          this.store.select(selectFragment)
        ),
      )),
      map(([action, nonce, fragment]) => {
        try {
          const [id_token, expires_in] = this.service.parseValidateToken(fragment, nonce);
          return validToken({id_token, expires_in});
        } catch(e) {
          return fail({error: 'Bad response'});
        }
      })
    )
  );

  validToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validToken),
      concatMap(action => of(action).pipe(
        withLatestFrom(
          this.store.select(selectUrl)
        ),
      )),
      map(([{expires_in}, url]) => {
        setTimeout(() => {
          this.store.dispatch(authenticate({url: this.router.url}));
        }, expires_in*1000);
        
        if (url) {
          this.router.navigateByUrl(url);
        }
      })
    ), {dispatch: false}
  );

  fail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fail),
      tap(({error}) => {
        console.log(error);
        
        this.router.navigateByUrl('/');
      })
    ), {dispatch: false}
  );
 
  constructor(
    private actions$: Actions, 
    private store: Store,
    private service: AuthService,
    private router: Router
  ) {}
}
