/**
 * Created by stefania on 7/5/16.
 */
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommunityContextService } from '../../services/communityContext.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'top-menu-landing',
  templateUrl: './topmenu-landing.component.html',
  styleUrls: ['../../../assets/css/landingpage/theme.css', '../../../assets/css/landingpage/custom.css', '../../../assets/css/landingpage/custom-provide.css', './topmenu-landing.component.css'],
})

export class TopmenuLandingComponent implements OnInit {
  baseLogoUrl = environment.LOGO_URL;

  userLoggedIn = false;
  userName = '';
  isUserAdmin = false;
  communityLogo?: string;

  inBeta: boolean;

  constructor(public authService: AuthenticationService, private communityService: CommunityContextService) { }

  ngOnInit() {
    this.getIsUserLoggedIn();
    this.getUserName();
    this.getIsUserAdmin();

    this.communityService.community.subscribe({
      next: (community) => {
        if (community !== null) {
          if (community.logoUrl.startsWith('http')) {
            this.communityLogo = community.logoUrl;
          } else {
            this.communityLogo = this.baseLogoUrl + community.logoUrl;
          }
        }
      }
    });

    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );
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

  getIsUserAdmin() {
    this.isUserAdmin = (this.authService.getUserRole().includes('Super_Administrator') ||
                        this.authService.getUserRole().includes('Content_Provider_Dashboard_Administrator'));
    return this.isUserAdmin;
  }
}
