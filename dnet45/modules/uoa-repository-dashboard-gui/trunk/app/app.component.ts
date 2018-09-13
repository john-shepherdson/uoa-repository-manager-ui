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
    /*disabling console.log in production*/
    if ( process.env.PRODUCTION === true ) {
      console.log = function () {};
    }

    // URL of the SPA to redirect the user to after login
    this.authService.redirectUrl = "/dashboard";

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
