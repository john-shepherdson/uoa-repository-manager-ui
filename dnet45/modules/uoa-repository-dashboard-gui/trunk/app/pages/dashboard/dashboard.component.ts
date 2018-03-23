import {AuthenticationService} from "../../services/authentication.service";
import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {}

  login() {
    this.authService.loginWithState();
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }
}
