import {AuthenticationService} from "../../services/authentication.service";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component ({
  selector: 'landing',
  templateUrl: 'landing.component.html'
})

export class LandingComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.checkIfIsLoggedIn();
  }


  login() {
    this.authService.loginWithState();
  }

  checkIfIsLoggedIn() {
    if ( this.authService.getIsUserLoggedIn() ) {
      this.router.navigate(['/dashboard']);
    }
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }
}
