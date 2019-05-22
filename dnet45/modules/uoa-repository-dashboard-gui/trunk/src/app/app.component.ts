import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { environment } from '../environments/environment';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'oa-repo-manager',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
              private authService: AuthenticationService,
              private matomoInjector: MatomoInjector,
              private matomoTracker: MatomoTracker) {

    console.log('11-02-2019. First deploy of project upgraded to angular 6');

    let piwikUrl;
    if (window.location.origin.includes('beta')) {
      // piwikUrl = 'https://analytics.openaire.eu/piwik.php?idsite=92&rec=1';
      piwikUrl = '92';
    } else if (window.location.origin.includes('localhost:4200') ||
               window.location.origin.includes('athenarc')) {
      // piwikUrl = 'https://analytics.openaire.eu/piwik.php?idsite=92&rec=1';
      piwikUrl = '9222222';
    } else {
      // piwikUrl = 'https://analytics.openaire.eu/piwik.php?idsite=111&rec=1';
      piwikUrl = '111';
    }
    this.matomoInjector.init('https://analytics.openaire.eu/', piwikUrl);

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
    if (this.authService.isLoggedIn) {
      this.matomoTracker.setUserId(this.authService.getUserEmail());
    }
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
