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
  isLoggedIn: boolean;

  constructor(public authService: AuthenticationService) { }

  ngOnInit(){
    this.isLoggedIn = false;
  }


  onClick(id: string) {
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login(){
    this.authService.loginWithState();
  }

  logout(){
    if(this.authService.isLoggedIn){
      this.authService.logout();
      this.isLoggedIn = false;
    }
  }

  register(){
    this.authService.loginWithState();
    this.isLoggedIn = true;
  }

  getUserName() {
    return this.authService.getUserName();
  }
}
