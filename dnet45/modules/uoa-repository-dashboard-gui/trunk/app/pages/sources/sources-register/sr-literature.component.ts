/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { DatasourceInfoFormComponent } from '../sources-forms/datasource-info-form.component';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { RepositoryService } from '../../../services/repository.service';

@Component ({
  selector:'app-sr-literature',
  templateUrl: 'sr-literature.component.html'
})

export class SrLiteratureComponent implements OnInit {
  showRepositories: boolean;
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  datasourceId: string;
  repo: Repository;

  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceShareableComponent;

  @ViewChild('updateDatasource')
  public updateDatasource: DatasourceInfoFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;
  repoInterfaces: RepositoryInterface[] = [];


  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService) {}

  ngOnInit() {
    this.showRepositories=true;

  }

  moveAStep(){
    if(this.showRepositories) {
      if (this.datasourcesByCountry.goToNextStep()) {
        this.showRepositories = false;
        this.showForm = true;
        this.step2 = 'active';
        console.log(`got datasource with id ${this.datasourceId}`);
      }
    } else if(this.showForm) {
      if (this.updateDatasource.updateRepo()){
        setTimeout( () => {
          this.getRepoInterfaces();
          this.group = this.fb.group({});
        }, 500 );
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

  getRepoId(emitedId: string) {
    this.datasourceId = emitedId;
  }

  getCurrentRepo(repo: Repository) {
    this.repo = repo;
  }

  getRepoInterfaces() {
    this.repoService.getRepositoryInterface(this.datasourceId).subscribe(
      interfaces => {
        this.repoInterfaces = interfaces;
        console.log(this.repoInterfaces.length);
      },
      error => console.log(error),
      () => {
        this.showForm = false;
        this.showInterfaces = true;
        this.step3 = 'active';
      }
    );
  }
}
