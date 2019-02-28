/**
 * Created by stefania on 1/19/17.
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
})

export class FooterComponent implements OnInit {
  inBeta: boolean;

  constructor() {}

  ngOnInit() {
    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );
  }

}
