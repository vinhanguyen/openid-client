import { createAction, props } from "@ngrx/store";
import { State } from "./auth.reducer";

export const authenticate = createAction('[Auth] authenticate', props<{url?: string}>());
export const nonceCreated = createAction('[Auth] nonce created', props<{nonce: number}>());
export const stateSaved = createAction('[Auth] state saved');
export const callback = createAction('[Auth] callback');
export const stateRestored = createAction('[Auth] state restored', props<{auth: State}>());
export const validToken = createAction('[Auth] valid token', props<{id_token: string, expires_in: number}>());
export const fail = createAction('[Auth] fail', props<{error: any}>());
