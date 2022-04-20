/*
*  updated by myrto on 19/12/2018
*/

import { Component, OnInit } from '@angular/core';
import { RegisterExistingDatasourceComponent } from './register-existing-datasource.component';

@Component ({
  selector: 'app-sr-literature',
  templateUrl: './register-existing-datasource.component.html'
})
export class SrCrisComponent extends RegisterExistingDatasourceComponent implements OnInit {

  ngOnInit() {
    this.datasourceType = 'cris';
    this.currentMode = 'cris';
    super.ngOnInit();
  }

}
