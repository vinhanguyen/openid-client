import { createReducer, on } from "@ngrx/store";
import { authenticate, validToken, nonceCreated, stateRestored } from "./auth.actions";

export const authFeatureKey = 'match';

export interface State {
  url?: string,
  nonce?: number,
  id_token?: string,
}

export const initialState: State = {
};

export const authReducer = createReducer(
  initialState,
  on(authenticate, (state, {url = null}) => (url ? {...state, url} : {...state})),
  on(nonceCreated, (state, {nonce}) => ({...state, nonce})),
  on(stateRestored, (state, {auth}) => ({...auth})),
  on(validToken, (state, {id_token}) => ({...state, id_token})),
);
