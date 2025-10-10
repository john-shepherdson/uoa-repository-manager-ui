

import {Component, OnInit} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {UsageStatsSummary} from '../../../../domain/typeScriptClasses';
import {AuthenticationService} from '../../../../services/authentication.service';
import {StatisticsService} from '../../../../services/statistics.service';
import {Router, RouterModule} from '@angular/router';


@Component({
  selector: 'app-gateway-home',
  templateUrl: './gateway-home.component.html',
  imports: [
    DecimalPipe,
    CommonModule,
    RouterModule,
  ],
  standalone: true
})

export class GatewayHomeComponent implements OnInit {
  statisticsNumbers: UsageStatsSummary;
  inBeta: boolean;




  constructor(private authService: AuthenticationService,
              private statsService: StatisticsService,
              private router: Router) {
  }

  ngOnInit() {
    this.getStatisticsNumbers();

    const baseUrl = window.location.origin;
    this.inBeta = (baseUrl.includes('beta') || baseUrl.includes('athenarc'));

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('dashboard');
    body.classList.add('landing');
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
      error => console.debug(error.message),
      () => {
        // console.log('statisticsNumbers is', JSON.stringify(this.statisticsNumbers));
      }
    );
  }

  goToPage(pageUrl: string) {
    if (this.authService.getIsUserLoggedIn()) {
      this.router.navigate([pageUrl]);
    } else {
      // this.authService.redirectUrl = pageUrl;
      this.login();
    }
  }
}

