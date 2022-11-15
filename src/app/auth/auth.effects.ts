import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { decodeJwt } from "jose";
import { concatMap, map, of, tap, withLatestFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { selectFragment } from "../router.selectors";
import { authenticate, callback, fail, getToken, nonceGenerated, stateRestored, stateSaved } from "./auth.actions";
import { selectAuth, selectNonce, selectUrl } from "./auth.selectors";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthEffects {

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authenticate),
      map((action) => {
        const nonce = this.service.getRandom();
        return nonceGenerated({nonce});
      })
    )
  );

  nonceGenerated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nonceGenerated),
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
      tap(([action, nonce]) => {
        const {authorization_endpoint, client_id} = environment;
        const response_type = 'token id_token';
        const scope = 'openid email profile';
    
        const {protocol, host} = window.location;
        const redirect_uri = `${protocol}//${host}/callback`;

        window.location.href = `${authorization_endpoint}?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&nonce=${nonce}`;
      })
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
      map(([action, nonce, fragment = '']) => {
        try {
          const params = fragment.split('&').reduce((obj, param) => {
            const [key, val] = param.split('=');
            obj[key] = val;
            return obj;
          }, <any>{});

          const {id_token, expires_in} = params;
      
          const {nonce: received} = decodeJwt(id_token);
  
          if (Number(received) !== nonce) {
            return fail({error: 'Nonce mismatch'});
          }

          return getToken({id_token, expires_in});
        } catch(e) {
          return fail({error: 'Bad response'});
        }
      })
    )
  );

  getToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getToken),
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
