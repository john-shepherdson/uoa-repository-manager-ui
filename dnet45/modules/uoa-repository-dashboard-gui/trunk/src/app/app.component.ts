import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'oa-repo-manager',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  piwikUrl: string;

  constructor(private router: Router,
              private authService: AuthenticationService) {
    /*disabling console.log in production*/
    if ( environment.production === true ) {
      console.log = function () {};
    }

    // URL of the SPA to redirect the user to after login
    // this.authService.redirectUrl = "/dashboard";

    if (window.location.pathname.includes('/compatibility/browseHistory/')) {
      this.authService.redirectUrl = window.location.pathname;
      console.log('redirectUrl', this.authService.redirectUrl);
    }

    this.authService.tryLogin();
  }

  ngOnInit() {
    /*if ((window.location.origin).includes('beta') ||
        (window.location.origin).includes('athenarc') ) {
      this.piwikUrl = 'https://analytics.openaire.eu/piwik.php?idsite=92&rec=1';
    } else {
      this.piwikUrl = 'https://analytics.openaire.eu/piwik.php?idsite=111&rec=1';
    }*/

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
