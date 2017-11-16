import {Component, OnInit} from '@angular/core';

@Component ({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  isLoggedIn: boolean;

  constructor() { }

  ngOnInit() {
    this.isLoggedIn = false;
  }

  login(){
    this.isLoggedIn = true;
  }

  logout(){
    this.isLoggedIn = false;
  }
}
