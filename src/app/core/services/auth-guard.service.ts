import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) { }

  canActivate(): boolean | Promise<boolean> {
    const token = this.authentication.getToken();
    const accessToken = this.authentication.getAccessToken();

    if (!token) {
      console.error('User is not authenticated.');
      this.redirectToLoginPage();
      return false;
    } else if (this.authentication.isAuthenticated()) {
      return true;
    } else {
      this.authentication.refreshToken();
      return true;
    }
  }

  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
}
