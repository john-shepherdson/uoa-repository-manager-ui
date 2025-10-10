import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityContextService } from 'src/app/services/communityContext.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-gateway-home',
    templateUrl: './gateway-home.component.html',
    standalone: true
})

export class GatewayHomeComponent  {
    currentCommunityId$: Observable<string | null> = null;

    constructor(private communityContextService: CommunityContextService, 
        private authService: AuthenticationService, private router: Router) {}

    login() {
        this.authService.loginWithState();
    }

    goToPage(pageUrl: string) {
    if (this.authService.getIsUserLoggedIn()) {
      this.router.navigate([pageUrl]);
    } else {
      // this.authService.redirectUrl = pageUrl;
      this.login();
    }
  }
}

