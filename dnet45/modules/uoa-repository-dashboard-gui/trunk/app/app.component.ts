/**
 * Created by stefania on 10/3/16.
 */
import {Component, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'openaire-dashboard',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  constructor(private router: Router,private authService: AuthenticationService) {
    // URL of the SPA to redirect the user to after login
    this.authService.redirectUrl = "/home";

/*    // The SPA's id. The SPA is registerd with this id at the auth-server
    this.authService.clientId = "dfd9f71e-2d7e-41a7-a9c5-bc27cc815868";

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    this.authService.scope = "openid";

    // The name of the auth-server that has to be mentioned within the token
    this.authService.loginUrl = "https://aai.openminted.eu/oidc/authorize";*/

    this.authService.tryLogin();

  }


  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
