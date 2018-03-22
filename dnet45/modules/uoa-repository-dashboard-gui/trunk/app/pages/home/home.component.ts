import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';


@Component ({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {}

  login() {
    this.authService.loginWithState();
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }
}
