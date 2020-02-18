import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { environment } from '../environments/environment';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'oa-repo-manager',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  open: boolean = true;

  constructor(private router: Router,
              private authService: AuthenticationService,
              private matomoInjector: MatomoInjector,
              private matomoTracker: MatomoTracker) {

    console.log('21-06-2019. Fixed matomo to log userIds?');

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
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.authService.isLoggedIn) {
        this.matomoTracker.setUserId(this.authService.getUserEmail());
      }
      window.scrollTo(0, 0);
    });
  }

  isHomeRoute() {
    // console.log('Is home route? Route is: ' + this.router.url);
    return (this.router.url === '/') || (this.router.url === '/landing');
  }

  public toggleOpen(event: MouseEvent) {
    event.preventDefault();
    this.open = !this.open;
  }

  // ngAfterContentInit() {
  //
  //   // this.loadScript('assets/js/common.js');
  //   // this.loadScript('assets/js/uikit_custom.js');
  //   // this.loadScript('assets/js/altair_admin_common.js');
  //   this.loadScript('assets/js/altair_admin_common.min.js');
  //
  //   // setTimeout( () => {
  //   //   // this.loadScript('assets/js/common.js');
  //   //   // this.loadScript('assets/js/uikit_custom.js');
  //   //   this.loadScript('assets/js/altair_admin_common.min.js');
  //   // }, 2000);
  //
  //   // $.getScript('assets/js/altair_admin_common.min.js');
  //
  //
  //
  //   // // Load the script
  //   // // var self = this;
  //   //
  //   // var script = <HTMLScriptElement>document.createElement("SCRIPT");
  //   // script.src = 'assets/js/altair_admin_common.min.js';
  //   // script.type = 'text/javascript';
  //   // // self.script = <HTMLScriptElement>document.createElement("SCRIPT");
  //   // // self.script.src = '../Content/js/settings.js';
  //   // // self.script.type = 'text/javascript';
  //   // document.getElementsByTagName("head")[0].appendChild(script);
  // }
  //
  // public loadScript(url) {
  //   console.log('preparing to load...')
  //   let node = document.createElement('script');
  //   node.src = url;
  //   node.type = 'text/javascript';
  //   document.getElementsByTagName('head')[0].appendChild(node);
  // }

}
