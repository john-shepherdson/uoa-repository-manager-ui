/**
 * Created by stefania on 7/5/16.
 */

import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'top-menu',
  templateUrl: './topmenu.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TopMenuComponent implements OnInit {
  userLoggedIn: boolean = false;
  userName: string = '';
  isUserAdmin: boolean = false;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.getIsUserLoggedIn();
    this.getUserName();
    this.getIsUserAdmin();
  }


  onClick(id: string) {
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login(){
    this.authService.loginWithState();
  }

  logout(){
    if( this.userLoggedIn ){
      this.authService.logout();
    }
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
