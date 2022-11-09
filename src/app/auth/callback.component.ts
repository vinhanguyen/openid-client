import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  template: ``
})
export class CallbackComponent implements OnInit, OnDestroy {
  fragmentSub!: Subscription;

  constructor(private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit(): void {
    this.fragmentSub = this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.auth.handleResponse(fragment);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.fragmentSub) {
      this.fragmentSub.unsubscribe();
    }
  }

}
