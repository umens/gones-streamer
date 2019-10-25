import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

// import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: NbAuthService, private router: Router) { }

  canActivate() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth/login']);
          }
        }),
      );
  }

  // constructor(
  //   private router: Router,
  //   private authentication: AuthenticationService
  // ) { }

  // canActivate(
  //   next?: ActivatedRouteSnapshot,
  //   state?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //     const token = this.authentication.getToken();
  //     const accessToken = this.authentication.getAccessToken();

  //     if (!token) {
  //       console.log('User is not authenticated.');
  //       this.redirectToLoginPage();
  //       return false;
  //     } else if (this.authentication.isAuthenticated()) {
  //       return true;
  //     } else {
  //       this.authentication.refreshToken();
  //       return true;
  //     }
  // }

  // redirectToLoginPage() {
  //   this.router.navigate(['/login']);
  // }
}
