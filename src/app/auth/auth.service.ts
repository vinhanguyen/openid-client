import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getRandom() {
    return self.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  constructor() { }
}
