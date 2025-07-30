
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import { getCookie } from '../domain/utils';

@Injectable ()
export class AuthGuardService implements CanActivate, CanLoad {

  constructor (private authenticationService: AuthenticationService, private router: Router) {}

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ( this.authenticationService.getIsUserLoggedIn() ) { return true; }



    // Store the attempted URL for redirecting
    if (state.url !== '/join') {
      /* If no cookie was found, clear the app's session.
      The user may have logged out using another OpenAIRE portal */
      sessionStorage.clear();
      this.authenticationService.redirectUrl = state.url;
      sessionStorage.setItem('state.location', state.url);
    }
    console.log('redirect state: ' + sessionStorage.getItem('state.location'));

    // If we decide that in this case we will send the user back to the aai
    // this.authenticationService.redirectUrl = state.url;
    // this.authenticationService.loginWithState();

    this.router.navigate(['/home']);

    return false;
  }

  canLoad () {

    if (this.authenticationService.getUserRole() &&
        (this.authenticationService.getUserRole().includes('Super_Administrator') ||
         this.authenticationService.getUserRole().includes('Content_Provider_Dashboard_Administrator')) ) {
      console.log('Admin recognized');
      return true;
    }

    this.router.navigate(['/home']);

    return false;
  }
}
