/*
*  created by myrto
*/


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sources-register',
  templateUrl: 'sources-register.component.html'
})

export class SourcesRegisterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
  }
}
