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

  constructor(private authService: AuthenticationService) { }

  ngOnInit(){
    this.isLoggedIn = false;
  }


  onClick(id: string) {
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login(){
    if(!this.authService.isLoggedIn){
      this.authService.login();
      this.isLoggedIn = true;
    }
  }

  logout(){
    if(this.authService.isLoggedIn){
      this.authService.logout();
      this.isLoggedIn = false;
    }
  }

  register(){
    this.authService.register();
    this.authService.login();
    this.isLoggedIn = true;
  }


}
