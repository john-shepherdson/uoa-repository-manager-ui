import {AuthenticationService} from "../../services/authentication.service";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { StatisticsService } from '../../services/statistics.service';

@Component ({
  selector: 'landing',
  templateUrl: 'landing.component.html'
})

export class LandingComponent implements OnInit {

  statisticsNumbers: Map<string,string>;
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
      res => this.statisticsNumbers = res,
      error => console.log(error),
      () => console.log(JSON.stringify(this.statisticsNumbers))
    );
  }

  onStartHerePush() {
    this.router.navigate(['/dashboard']);
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }
}
