/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit } from '@angular/core';
import { RegisterExistingDatasourceComponent } from './register-existing-datasource.component';

@Component ({
  selector: 'app-sr-data',
  templateUrl: './register-existing-datasource.component.html'
})

export class SrDataComponent extends RegisterExistingDatasourceComponent implements OnInit {

  ngOnInit() {
    this.datasourceType = 'data';
    this.currentMode = 're3data';
    super.ngOnInit();
  }

}
