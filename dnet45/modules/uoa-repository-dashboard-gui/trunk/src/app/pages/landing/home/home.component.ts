import { Component, OnInit } from '@angular/core';
import { UsageStatsSummary } from '../../../domain/typeScriptClasses';
import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Router } from '@angular/router';

@Component ({
  selector: 'app-landing',
  templateUrl: './home.component.html',
  styleUrls: ['../../../../assets/css/landingpage/theme.css','../../../../assets/css/landingpage/custom.css','../../../../assets/css/landingpage/custom-provide.css'],
})

export class HomeComponent implements OnInit {

  statisticsNumbers: UsageStatsSummary;
  inBeta: boolean;


  constructor(private authService: AuthenticationService,
              private statsService: StatisticsService,
              private router: Router) { }

  ngOnInit() {
    this.getStatisticsNumbers();

    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("dashboard");
    body.classList.add("landing");
  }


  login() {
    this.authService.loginWithState();
  }

  getStatisticsNumbers() {
    this.statsService.getStatisticsNumbers().subscribe(
      res => {
        this.statisticsNumbers = res;
        // this.statisticsNumbers.lastYearUsagestats = JSON.parse(res['lastYearUsagestats'].toString());
      },
      error => console.log(error),
      () => {
        console.log('statisticsNumbers is', JSON.stringify(this.statisticsNumbers));
      }
    );
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
