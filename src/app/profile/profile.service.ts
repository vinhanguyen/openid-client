import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  getUser() {
    return this.http.get<any>(`${environment.api_endpoint}/user`, {
      headers: {
        Authorization: `Bearer ${this.auth.idToken}`
      }
    });
  }

  constructor(private http: HttpClient, private auth: AuthService) { }
}
