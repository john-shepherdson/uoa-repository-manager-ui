import {AuthenticationService} from "../../services/authentication.service";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { StatisticsService } from '../../services/statistics.service';
import { UsageStatsSummary } from '../../domain/typeScriptClasses';

@Component ({
  selector: 'landing',
  templateUrl: './landing.component.html'
})

export class LandingComponent implements OnInit {

  statisticsNumbers: UsageStatsSummary;
  inBeta: boolean;


  constructor(private authService: AuthenticationService,
              private statsService: StatisticsService,
              private router: Router) { }

  ngOnInit() {
    this.getStatisticsNumbers();

    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );
  }


  login() {
    this.authService.loginWithState();
  }

  getStatisticsNumbers() {
    this.statsService.getStatisticsNumbers().subscribe(
      res => {
      	this.statisticsNumbers = res;
      	this.statisticsNumbers.lastYearUsagestats = JSON.parse(res['lastYearUsagestats'].toString());
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
