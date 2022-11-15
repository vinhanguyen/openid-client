import { createAction, props } from "@ngrx/store";
import { State } from "./auth.reducer";

export const authenticate = createAction('[Auth] authenticate', props<{url?: string}>());
export const nonceGenerated = createAction('[Auth] nonce generated', props<{nonce: number}>());
export const stateSaved = createAction('[Auth] state saved');
export const callback = createAction('[Auth] callback');
export const stateRestored = createAction('[Auth] state restored', props<{auth: State}>());
export const getToken = createAction('[Auth] get token', props<{id_token: string, expires_in: number}>());
export const fail = createAction('[Auth] fail', props<{error: any}>());
