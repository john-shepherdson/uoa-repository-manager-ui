/*
*  created by andreas on 4/7/2022
*/

import { Component, OnInit } from '@angular/core';
import { RegisterExistingDatasourceComponent } from './register-existing-datasource.component';

@Component ({
  selector: 'app-sr-repository',
  templateUrl: './register-existing-datasource.component.html'
})
export class SrRepositoryComponent extends RegisterExistingDatasourceComponent implements OnInit {

  ngOnInit() {
    this.datasourceType = 'repository';
    this.currentMode = 'repository';
    super.ngOnInit();
  }

}
