import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { RepositoryService } from '../../services/repository.service';
import { Repository, RuleSet } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import {
  loadingReposMessage, loadingRuleSets, loadingRuleSetsError,
  loadingUserRepoInfoError, loadingValSets, loadingValSetsError, noRuleSets
} from '../../domain/shared-messages';
import { ValidatorService } from '../../services/validator.service';
import { CompatibilityValidateStep2Component } from './compatibility-validate-forms/compatibility-validate-step2.component';
import { CompatibilityValidateStep3Component } from './compatibility-validate-forms/compatibility-validate-step3.component';

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
  chosenUrl: string;
  ruleSets: RuleSet[] = [];
  valSets: string[] = [];

  errorMessage: string;
  loadingMessage: string;
  showSpinner: boolean;

  @ViewChild('step1ChooseBaseUrl') step1ChooseBaseUrl : CompatibilityValidateStep1Component;
  @ViewChild('step2ChooseGuidelines') step2ChooseGuidelines : CompatibilityValidateStep2Component;
  @ViewChild('step3ChooseParameters') step3ChooseParameters : CompatibilityValidateStep3Component;

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private repoService: RepositoryService,
              private valService: ValidatorService) {}

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
      if (this.step1ChooseBaseUrl.submitForm()) {
        this.chosenUrl = this.step1ChooseBaseUrl.chosenUrl;
        this.getRuleSetsForType();
      }
    } else if (this.showGuidelines) {
      this.getValidationSets();
      this.showParameters = true;
      this.showGuidelines = false;
      this.step3 = 'active';
    } else if (this.showParameters) {
      this.showFinish = true;
      this.showParameters = false;
      this.step4 = 'active';
    }
  }

  moveBackAStep () {
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
    this.loadingMessage = loadingReposMessage;
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

  getRuleSetsForType() {
    this.showSpinner = true;
    this.loadingMessage = loadingRuleSets;
    this.valService.getRuleSets(this.type)
      .subscribe(
        rules => this.ruleSets = rules,
        error => {
          this.showSpinner = false;
          this.loadingMessage = '';
          this.errorMessage = loadingRuleSetsError;
        },
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
          this.showDatasource = false;
          this.step2 = 'active';
          if (this.ruleSets.length) {
            this.showGuidelines = true;
          } else {
            this.errorMessage = noRuleSets;
          }
        }
      );
  }

  getValidationSets() {
    this.showGuidelines = false;
    this.showSpinner = true;
    this.loadingMessage = loadingValSets;
    this.valService.getSetsOfRepository(this.chosenUrl)
      .subscribe(
        sets => this.valSets = sets,
        error => {
          this.showSpinner = false;
          this.loadingMessage = '';
          this.errorMessage = loadingValSetsError
        },
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
          this.step2 = 'active';
          this.showParameters = true;
        }
      );
  }
}
