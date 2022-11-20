import { Injectable } from '@angular/core';
import { decodeJwt } from 'jose';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  createNonce() {
    return self.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  sendAuthReq(nonce: number | undefined) {
    const {authorization_endpoint, client_id} = environment;
    const response_type = 'token id_token';
    const scope = 'openid email profile';

    const {protocol, host} = window.location;
    const redirect_uri = `${protocol}//${host}/callback`;

    const params = [
      `response_type=${response_type}`,
      `client_id=${client_id}`,
      `scope=${scope}`,
      `redirect_uri=${redirect_uri}`,
      `nonce=${nonce}`
    ].join('&');

    window.location.href = `${authorization_endpoint}?${params}`;
  }

  parseValidateToken(fragment: string | undefined, nonce: number | undefined): [string, number] {
    const params = fragment?.split('&').reduce((obj, param) => {
      const [key, val] = param.split('=');
      obj[key] = val;
      return obj;
    }, <any>{});

    const {id_token, expires_in} = params;

    const {nonce: received} = decodeJwt(id_token);

    if (Number(received) !== nonce) {
      throw 'Nonce mismatch';
    }

    return [id_token, expires_in];
  }

  constructor() { }
}
