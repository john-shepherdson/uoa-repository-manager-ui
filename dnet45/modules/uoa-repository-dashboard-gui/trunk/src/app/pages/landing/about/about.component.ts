import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Router } from '@angular/router';

@Component ({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../../../../assets/css/landingpage/theme.css','../../../../assets/css/landingpage/custom.css','../../../../assets/css/landingpage/custom-provide.css'],
})

export class AboutComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private statsService: StatisticsService,
              private router: Router) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("dashboard");
    body.classList.add("landing");
  }

  login() {
    this.authService.loginWithState();
  }


  goToPage(pageUrl: string) {
    if (this.authService.getIsUserLoggedIn()) {
      this.router.navigate([pageUrl]);
    } else {
      this.authService.redirectUrl = pageUrl;
      this.login();
    }
  }

}
