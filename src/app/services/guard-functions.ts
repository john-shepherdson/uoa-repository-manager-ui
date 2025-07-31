import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from './authentication.service';


export const GatewayAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  // check role
  if (auth.getUserRole().includes('beta_gateway')) {
    return true;
  }

  // redirect to unauthorized, preserving the attempted URL
  return router.createUrlTree(['/403-forbidden'], {
    // queryParams: { returnUrl: state.url }
  });
};
