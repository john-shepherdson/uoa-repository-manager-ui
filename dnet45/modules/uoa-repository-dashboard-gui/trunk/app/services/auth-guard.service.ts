
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import { getCookie } from '../domain/utils';
import {apiUrl} from "../domain/tempAPI";

@Injectable ()
export class AuthGuardService implements CanActivate {

//  private oidc_endpoint : string = process.env.OIDC_ENDPOINT;
  /*private loginUrl : string = `${apiUrl}/openid_connect_login`;*/
  private loginUrl = process.env.AAI_ENDPOINT;

  constructor (private authenticationService: AuthenticationService, private router: Router) {}

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if ( this.authenticationService.getIsUserLoggedIn() ) { return true; }

    if ( getCookie('currentUser') != null ) { return true; }

    // Store the attempted URL for redirecting
    sessionStorage.setItem("state.location",state.url);

    // Navigate to the login page via the API
    /*window.location.href = this.loginUrl;*/
    this.router.navigate(['/landing']);

    return false;
  }
}
