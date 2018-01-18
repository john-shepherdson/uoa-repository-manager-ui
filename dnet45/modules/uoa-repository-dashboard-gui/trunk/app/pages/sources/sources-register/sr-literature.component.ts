/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Repository } from '../../../domain/typeScriptClasses';
import { DatasourceInfoFormComponent } from '../sources-forms/datasource-info-form.component';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';

@Component ({
  selector:'app-sr-literature',
  templateUrl: 'sr-literature.component.html'
})

export class SRLiteratureComponent implements OnInit {
  showRepositories: boolean;
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;

  datasourceId: string;

  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceShareableComponent;

  constructor() {}

  ngOnInit() {
    this.showRepositories=true;

  }

  getDatasourceId(id: string){
    this.datasourceId = id;
    this.showRepositories = false;
    this.showForm = true;
    console.log(`got datasource with id ${this.datasourceId}`);
  }
}
