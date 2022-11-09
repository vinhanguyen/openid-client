import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  idToken!: string;

  login(url?: string) {
    if (url) {
      localStorage.setItem('url', url);
    }

    const {authorization_endpoint, client_id} = environment;
    const response_type = 'token id_token';
    const scope = 'openid email profile';

    const {protocol, host} = window.location;
    const redirect_uri = `${protocol}//${host}/callback`;

    const nonce = self.crypto.getRandomValues(new Uint32Array(1))[0];
    localStorage.setItem('nonce', nonce.toString());
    
    window.location.href = `${authorization_endpoint}?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&nonce=${nonce}`;
  }

  handleResponse(fragment: string) {
    const params = fragment.split('&').reduce((obj, param) => {
      const [key, val] = param.split('=');
      obj[key] = val;
      return obj;
    }, <any>{});
    
    const {id_token, expires_in} = params;

    const sent = localStorage.getItem('nonce');
                  localStorage.removeItem('nonce');
    const {nonce: received} = decodeJwt(id_token);
    if (sent !== received) {
      this.router.navigateByUrl('/');
      return;
    }

    this.idToken = id_token;

    setTimeout(() => {
      this.login(this.router.url);
    }, expires_in*1000);
    
    const url = localStorage.getItem('url');
    if (url) {
      localStorage.removeItem('url');
      this.router.navigateByUrl(url);
    }
  }

  constructor(private router: Router) { }
}
