import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';

@Component ({
  selector: 'app-sr-data',
  templateUrl: 'sr-data.component.html'
})


export class SrDataComponent implements OnInit {
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
