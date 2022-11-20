import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { selectToken } from '../auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnDestroy {
  token!: string;
  tokenSub!: Subscription;

  getUser() {
    return this.http.get<any>(`${environment.api_endpoint}/user`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  constructor(private http: HttpClient, private store: Store) {
    this.tokenSub = this.store.select(selectToken).subscribe(token => {
      if (token) {
        this.token = token;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tokenSub) {
      this.tokenSub.unsubscribe();
    }
  }
}
