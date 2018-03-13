import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component ({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {}

  callTopMenu() {
    setTimeout( () => {
        this.router.navigate(['/sources/register'], {relativeTo: this.route});
      }, 500);
  }
}
