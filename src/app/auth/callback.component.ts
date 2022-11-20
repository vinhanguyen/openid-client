import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { callback } from './auth.actions';

@Component({
  template: ``
})
export class CallbackComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(callback());
  }

}
