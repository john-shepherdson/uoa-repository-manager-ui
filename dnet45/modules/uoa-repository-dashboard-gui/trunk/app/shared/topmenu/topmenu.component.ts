/**
 * Created by stefania on 7/5/16.
 */

import { Component, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'top-menu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TopMenuComponent implements OnInit {
  userLoggedIn: boolean = false;
  userName: string = '';
  isUserAdmin: boolean = false;
  adminHomePage = process.env.FAQ_HOMEPAGE;

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
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login(){
    this.authService.loginWithState();
  }

  logout(){
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
    this.isUserAdmin = (this.authService.getUserRole().includes('ROLE_ADMIN'));
    return this.isUserAdmin;
  }
}
