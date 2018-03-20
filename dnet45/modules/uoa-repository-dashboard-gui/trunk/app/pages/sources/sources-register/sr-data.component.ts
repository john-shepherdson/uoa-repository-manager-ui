/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';
import { DatasourceUpdateFormComponent } from '../sources-forms/datasource-update-form.component';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RepositoryService } from '../../../services/repository.service';
import { formInfoLoading, loadingRepoError } from '../../../domain/shared-messages';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component ({
  selector: 'app-sr-data',
  templateUrl: 'sr-data.component.html'
})

export class SrDataComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  showRepositories: boolean;
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  datasourceId: string;
  repo: Repository;

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'selectDatasource','basicInformation','interfaces','finish'
   */
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);


  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceShareableComponent;

  @ViewChild('updateDatasource')
  public updateDatasource: DatasourceUpdateFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;
  repoInterfaces: RepositoryInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private repoService: RepositoryService) {}

  ngOnInit() {
    this.setQueryParam('selectDatasource');
    this.showRepositories=true;
  }

  moveAStep(){
    if(this.showRepositories) {
      if (this.datasourcesByCountry.goToNextStep()) {
        this.setQueryParam('basicInformation');
        this.showRepositories = false;
        this.showForm = true;
        this.step2 = 'active';
        console.log(`got datasource with id ${this.datasourceId}`);
      }
    } else if(this.showForm) {
        this.updateDatasource.updateRepo();
    } else if(this.showInterfaces) {
        this.setQueryParam('finish');
        this.showInterfaces = false;
        this.showFinish = true;
        this.step4 = 'active';
    }
  }

  moveBackAStep(){
    if(this.showForm) {
      this.setQueryParam('baseUrl');
      this.showRepositories = true;
      this.showForm = false;
      this.step2 = '';
    } else if(this.showInterfaces) {
      this.setQueryParam('basicInformation');
      this.showForm = true;
      this.showInterfaces = false;
      this.step3 = '';
    } else if(this.showFinish) {
      this.setQueryParam('interfaces');
      this.showInterfaces = true;
      this.showFinish = false;
      this.step4 = '';
    }
  }

  goToStep2(emitted: boolean) {
    if (emitted) {
      this.moveAStep();
    }
  }

  getRepoId(emitedId: string) {
    this.datasourceId = emitedId;
    this.getRepo();
  }

  getRepo() {
    this.loadingMessage = formInfoLoading;
    if (this.datasourceId) {
      this.repoService.getRepositoryById(this.datasourceId).subscribe(
        repo => {
          this.repo = repo;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        },
        () => {
          this.loadingMessage = '';
        }
      );
    }
  }

  getUpdatedRepo(repo: Repository){
    this.repo = repo;
    console.log(`repo was updated!`);
    this.group = this.fb.group({});
    this.getRepoInterfaces();
  }

  getRepoInterfaces() {
    this.repoService.getRepositoryInterface(this.datasourceId).subscribe(
      interfaces => {
        this.repoInterfaces = interfaces;
        console.log(this.repoInterfaces.length);
      },
      error => console.log(error),
      () => {
        this.setQueryParam('interfaces');
        this.showForm = false;
        this.showInterfaces = true;
        this.step3 = 'active';
      }
    );
  }

  downloadLogo() {
    window.open("../../../assets/imgs/3_0ValidatedLogo.png","_blank", "enabledstatus=0,toolbar=0,menubar=0,location=0");
  }

  setQueryParam(value: string) {
    // set param for step
    this.queryParams['step'] = value;
    this.router.navigate([], { relativeTo: this.route, queryParams: this.queryParams });
  }

}
