import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { selectToken } from '../auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  getUser() {
    return this.store.select(selectToken).pipe(
      mergeMap(token => this.http.get<any>(`${environment.api_endpoint}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }))
    );
  }

  constructor(private http: HttpClient, private store: Store) { }
}
