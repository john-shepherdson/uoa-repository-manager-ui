
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import { getCookie } from '../domain/utils';

@Injectable ()
export class AuthGuardService implements CanActivate, CanLoad {

  constructor (private authenticationService: AuthenticationService, private router: Router) {}

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if ( (getCookie('openAIREUser') !== null) &&
         (getCookie('openAIREUser') !== '') &&
         this.authenticationService.getIsUserLoggedIn() ) { return true; }

    if ( (getCookie('openAIREUser') !== null) && (getCookie('openAIREUser') !== '') ) { return true; }

    /* If no cookie was found, clear the app's session.
       The user may have logged out using another OpenAIRE portal */
    localStorage.clear();
    sessionStorage.clear();

    // Store the attempted URL for redirecting
    sessionStorage.setItem('state.location', state.url);

    // If we decide that in this case we will send the user back to the aai
    // this.authenticationService.redirectUrl = state.url;
    // this.authenticationService.loginWithState();

    this.router.navigate(['/landing']);

    return false;
  }

  canLoad () {

    if (this.authenticationService.getUserRole() &&
        (this.authenticationService.getUserRole().includes('ROLE_ADMIN') ||
         this.authenticationService.getUserRole().includes('ROLE_PORTAL_ADMIN')) ) {

      return true;
    }

    this.router.navigate(['/landing']);

    return false;
  }
}
