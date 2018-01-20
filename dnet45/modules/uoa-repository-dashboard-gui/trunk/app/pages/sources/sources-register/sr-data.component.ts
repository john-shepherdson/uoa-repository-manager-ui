import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';
import { DatasourceInfoFormComponent } from '../sources-forms/datasource-info-form.component';

@Component ({
  selector: 'app-sr-data',
  templateUrl: 'sr-data.component.html'
})


export class SrDataComponent implements OnInit {
  showRepositories: boolean;
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  datasourceId: string;

  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceShareableComponent;

  @ViewChild('updateDatasource')
  public updateDatasource: DatasourceInfoFormComponent;

  constructor() {}

  ngOnInit() {
    this.showRepositories=true;
  }

  moveAStep(){
    if(this.showRepositories) {
      if (this.datasourcesByCountry.goToNextStep()) {
        this.datasourceId = this.datasourcesByCountry.repoId;
        this.showRepositories = false;
        this.showForm = true;
        this.step2 = 'active';
        console.log(`got datasource with id ${this.datasourceId}`);
      }
    } else if(this.showForm) {
      if (this.updateDatasource.updateRepo()){
        this.showForm = false;
        this.showInterfaces = true;
        this.step3 = 'active';
      }
    } else if(this.showInterfaces) {
        this.showInterfaces = false;
        this.showFinish = true;
        this.step4 = 'active';
    }
  }

  moveBackAStep(){
    if(this.showForm) {
      this.showRepositories = true;
      this.showForm = false;
      this.step2 = '';
    } else if(this.showInterfaces) {
      this.showForm = true;
      this.showInterfaces = false;
      this.step3 = '';
    } else if(this.showFinish) {
      this.showInterfaces = true;
      this.showFinish = false;
      this.step4 = '';
    }
  }
}
