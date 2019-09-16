import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.Service';


@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationServices: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationServices.currentUserValue;
    if (currentUser) {// logged in so return true
      //checks whether route is restricted by role
      if (currentUser.clear === false) {
        //not authorised so redirect to home page
        this.router.navigate(['/Account'])
        return false;
      }
      //authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/land'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
