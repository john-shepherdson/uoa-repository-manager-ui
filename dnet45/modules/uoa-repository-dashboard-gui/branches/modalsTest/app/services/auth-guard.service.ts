
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable ()
export class AuthGuardService implements CanActivate {

  private oidc_endpoint : string = process.env.OIDC_ENDPOINT;

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authenticationService.isLoggedIn) { return true; }
      //if (getCookie('name') != null) return true;
    // Store the attempted URL for redirecting
    sessionStorage.setItem("state.location",state.url);
    // Navigate to the login page
    //window.location.href = this.oidc_endpoint;

    window.location.href = '/home';

    return false;
  }
}
