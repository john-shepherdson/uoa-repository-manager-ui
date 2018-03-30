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
  }


  login() {
    this.authService.loginWithState();
  }

  onStartHerePush() {
    this.router.navigate(['/dashboard']);
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }
}
