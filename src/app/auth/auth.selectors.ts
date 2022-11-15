import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authFeatureKey, State } from "./auth.reducer";

export const selectAuth = createFeatureSelector<State>(authFeatureKey);

export const selectNonce = createSelector(
  selectAuth,
  state => state.nonce
);

export const selectUrl = createSelector(
  selectAuth,
  state => state.url
);

export const selectToken = createSelector(
  selectAuth,
  state => state.id_token
);
