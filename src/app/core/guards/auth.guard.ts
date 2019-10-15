import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) { }

  canActivate(
    next?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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
