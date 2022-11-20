import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authFeatureKey, authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';

@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(authFeatureKey, authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [
    CallbackComponent
  ]
})
export class AuthModule { }
