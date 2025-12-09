import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.getIsUserLoggedIn()) {
    return true;
  }

  if (state.url !== '/join') {
    sessionStorage.clear();
    authenticationService.redirectUrl = state.url;
    sessionStorage.setItem('state.location', state.url);
  }

  console.log('redirect state: ' + sessionStorage.getItem('state.location'));
  router.navigate(['/home']);
  return false;
};

export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const role = authenticationService.getUserRole();
  if (role && (role.includes('Super_Administrator') || role.includes('Content_Provider_Dashboard_Administrator'))) {
    console.debug('Admin recognized');
    return true;
  }

  router.navigate(['/home']);
  return false;
};
