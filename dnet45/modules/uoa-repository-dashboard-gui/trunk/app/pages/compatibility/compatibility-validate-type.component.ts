import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { RepositoryService } from '../../services/repository.service';
import { Repository } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import {
  loadingReposMessage, loadingUserRepoInfo, loadingUserRepoInfoEmpty,
  loadingUserRepoInfoError
} from '../../domain/shared-messages';

@Component ({
  selector: 'compatibility-validate-literature',
  templateUrl: 'compatibility-validate-type.component.html'
})

export class CompatibilityValidateTypeComponent implements OnInit {
  type: string = '';
  showDatasource: boolean;
  showGuidelines: boolean;
  showParameters: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  baseUrlList: string[] = [];
  errorMessage: string;
  loadingMessage: string;
  showSpinner: boolean;

  @ViewChild('step1ChooseBaseUrl') step1ChooseBaseUrl : CompatibilityValidateStep1Component;

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.readType();
    this.getBaseUrlList();
  }

  readType() {
    this.type = this.route.snapshot.paramMap.get('type');
    console.log(this.type);
  }

  moveAStep(){
    if (this.showDatasource) {
      if(this.step1ChooseBaseUrl.submitForm()) {
        this.showGuidelines = true;
        this.showDatasource = false;
        this.step2 = 'active';
      }
    } else if (this.showGuidelines) {
      this.showParameters = true;
      this.showGuidelines = false;
      this.step3 = 'active';
    } else if (this.showParameters) {
      this.showFinish = true;
      this.showParameters = false;
      this.step4 = 'active';
    }
  }

  moveBackAStep(){
    if (this.showGuidelines) {
      this.showDatasource = true;
      this.showGuidelines = false;
      this.step2 = '';
    } else if (this.showParameters) {
      this.step3 = '';
      this.showGuidelines = true;
      this.showParameters = false;
    } else if (this.showFinish) {
      this.showParameters = true;
      this.showFinish = false;
      this.step4 = '';
    }
  }

  /* retrieves the baseUrl list for the registered repositories of the user */
  getBaseUrlList(): void {
    this.showSpinner = true;
    this.loadingMessage = loadingUserRepoInfo;
//    this.repoService.getUrlsOfUserRepos(this.authService.getUserEmail()) RESTORE AFTER FINISH!!
    this.repoService.getUrlsOfUserRepos('ant.lebesis@gmail.com')
      .subscribe(
        repos => this.baseUrlList = repos.sort( function(a , b){
          if(a < b ){
            return -1;
          } else if(a > b ){
            return 1;
          } else {
            return 0;
          }
        }),
        error => {
          console.log(error);
          this.showSpinner = false;
          this.loadingMessage = '';
          this.errorMessage = loadingUserRepoInfoError;
        },
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
          this.showDatasource = true;
        }
      );
  }

}
