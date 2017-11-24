/**
 * Created by stefania on 10/3/16.
 */
import {Component, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'openaire-dashboard',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
