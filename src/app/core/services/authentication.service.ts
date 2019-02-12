import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token = {
    refresh_token: 'refreshtokencode',
    exp: new Date((new Date().getDate() + 1)),
    access_token: {
      host: 'localhost',
      port: 4444,
      password: ''
    }
  };

  tokenKey = 'a6smm_utoken';

  constructor(private router: Router) { }

  login(host: string, port: number, password: string) {
    this.token.access_token = {
      host: host,
      port: port,
      password: password
    };
    this.setToken(this.token);
    this.router.navigate(['/remote-center']);
  }

  logout() {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  getToken() {
    return JSON.parse(localStorage.getItem(this.tokenKey));
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  getAccessToken() {
    if (localStorage.getItem(this.tokenKey) != null) {
      return JSON.parse(localStorage.getItem(this.tokenKey))['access_token'];
    } else {
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);

    if (token) {
      return true;
    } else {
      return false;
    }
  }

  refreshToken() {
    this.token.exp = new Date((new Date().getDate() + 1));
    this.setToken(this.token);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
