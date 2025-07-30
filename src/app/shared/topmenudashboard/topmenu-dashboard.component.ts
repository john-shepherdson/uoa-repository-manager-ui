import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommunityContextService } from '../../services/communityContext.service';

@Component({
  selector: 'top-menu-dashboard',
  templateUrl: './topmenu-dashboard.component.html',
})

export class TopmenuDashboardComponent implements OnInit {
  userLoggedIn = false;
  userName = '';
  isUserAdmin = false;
  isUserGatewayAdmin = false;
  communityLogo?: string;

  inBeta: boolean;

  showSideBar = true;

  constructor(public authService: AuthenticationService, private communityService: CommunityContextService) { }

  ngOnInit() {
    this.getIsUserLoggedIn();
    this.getUserName();
    this.getIsUserAdmin();

    this.communityService.community.subscribe({
      next: (community) => {
        if (community !== null)
          this.communityLogo = community.logoUrl;
      }
    });

    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );
  }

  toggleSideMenu() {
    const body = document.getElementsByTagName('body')[0];
    if (this.showSideBar === true) {
      body.classList.remove('sidebar_main_open');
    } else {
      body.classList.add('sidebar_main_open');
    }
    this.showSideBar = !this.showSideBar;
  }

  onClick(id: string) {
    const el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login() {
    this.authService.loginWithState();
  }

  logout() {
    this.authService.logout();
  }


  getUserName() {
    this.userName = this.authService.getUserName();
    return this.userName;
  }

  getIsUserLoggedIn() {
    this.userLoggedIn = this.authService.getIsUserLoggedIn();
    return this.userLoggedIn;
  }

  parseUsername() {
    let firstLetters = '';
    const matches = this.getUserName().match(/\b(\w)/g);
    if (matches)
      firstLetters += matches.join('');
    return firstLetters;
  }

  getIsUserAdmin() {
    this.isUserAdmin = (this.authService.getUserRole().includes('Super_Administrator') ||
      this.authService.getUserRole().includes('Content_Provider_Dashboard_Administrator'));
    return this.isUserAdmin;
  }

  getUserGatewayAdmin() {
    return this.isUserGatewayAdmin = this.authService.getUserRole().includes('beta_gateway');
  }
}
