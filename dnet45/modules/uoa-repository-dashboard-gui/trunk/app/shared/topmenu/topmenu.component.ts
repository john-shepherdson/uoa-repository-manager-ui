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

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {}


  onClick(id: string) {
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login(){
    this.authService.loginWithState();
  }

  logout(){
    if(this.getIsUserLoggedIn()){
      this.authService.logout();
    }
  }

  register(){
    this.authService.loginWithState();
  }

  getUserName() {
    return this.authService.getUserName();
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }

  isUserAdmin() {
    return this.authService.getUserRole().includes('ROLE_ADMIN');
  }
}
