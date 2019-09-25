import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-compatibility-validation',
  templateUrl: 'compatibility-validate.component.html'
})

export class CompatibilityValidateComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
  }
}
