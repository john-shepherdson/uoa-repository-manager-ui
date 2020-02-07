/**
 * Created by stefania on 7/5/16.
 */
import { Component, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'top-menu-landing',
  templateUrl: './topmenu-landing.component.html',
  styleUrls: ['../../../assets/css/landingpage/theme.css','../../../assets/css/landingpage/custom.css','../../../assets/css/landingpage/custom-provide.css','./topmenu-landing.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class TopmenuLandingComponent implements OnInit {
  userLoggedIn = false;
  userName = '';
  isUserAdmin = false;
  adminHomePage = environment.FAQ_HOMEPAGE;

  inBeta: boolean;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.getIsUserLoggedIn();
    this.getUserName();
    this.getIsUserAdmin();

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
    this.isUserAdmin = (this.authService.getUserRole().includes('ROLE_ADMIN') ||
                        this.authService.getUserRole().includes('ROLE_PROVIDE_ADMIN'));
    return this.isUserAdmin;
  }
}
