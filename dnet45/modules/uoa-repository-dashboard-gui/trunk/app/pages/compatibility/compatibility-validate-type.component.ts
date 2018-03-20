import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { RepositoryService } from '../../services/repository.service';
import { InterfaceInformation, JobForValidation, Repository, RuleSet } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import {
  identifyingUrl, invalidCustomBaseUrl,
  loadingReposMessage, loadingRuleSets, loadingRuleSetsError,
  loadingUserRepoInfoError, loadingValSets, loadingValSetsError, noRuleSets, noServiceMessage, submittingJobError
} from '../../domain/shared-messages';
import { ValidatorService } from '../../services/validator.service';
import { CompatibilityValidateStep2Component } from './compatibility-validate-forms/compatibility-validate-step2.component';
import { CompatibilityValidateStep3Component } from './compatibility-validate-forms/compatibility-validate-step3.component';
import { CompatibilityValidateStep3CrisComponent } from './compatibility-validate-forms/compatibility-validate-step3-cris.component';

@Component ({
  selector: 'compatibility-validate-literature',
  templateUrl: 'compatibility-validate-type.component.html'
})

export class CompatibilityValidateTypeComponent implements OnInit {
  type: string = '';

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'baseUrl','guidelines','crisEntities'/'parameters','finish'
   */
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);


  showDatasource: boolean;
  showGuidelines: boolean;
  showParameters: boolean;
  showCrisEntities: boolean;
  showFinish: boolean;

  step2: string = '';
  step3: string = '';
  step4: string = '';

  baseUrlList: string[] = [];
  ruleSets: RuleSet[] = [];
  valSets: string[] = [];

  chosenUrl: string;
  identifiedUrl: boolean;
  chosenGuidelinesAcronym: string;
  chosenContentRules: number[];
  chosenUsageRules: number[];
  chosenValSet: string;
  noOfRecords: number;
  xPath: string;
  chosenCrisEntities: string[];
  crisRefIntegrity: boolean;

  errorMessage: string;
  loadingMessage: string;

  @ViewChild('step1ChooseBaseUrl') step1ChooseBaseUrl : CompatibilityValidateStep1Component;
  @ViewChild('step2ChooseGuidelines') step2ChooseGuidelines : CompatibilityValidateStep2Component;
  @ViewChild('step3ChooseParameters') step3ChooseParameters : CompatibilityValidateStep3Component;
  @ViewChild('step3ChooseCrisEntities') step3ChooseCrisEntities : CompatibilityValidateStep3CrisComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService,
              private repoService: RepositoryService,
              private valService: ValidatorService) {}

  ngOnInit() {
    this.readType();
    this.setQueryParam('baseUrl');
    this.showDatasource = true;
    this.getBaseUrlList();
  }

  readType() {
    this.type = this.route.snapshot.paramMap.get('type');
    console.log(this.type);
  }

  /* retrieves the baseUrl list for the registered repositories of the user */
  getBaseUrlList() {
    this.loadingMessage = loadingReposMessage;
    this.repoService.getUrlsOfUserRepos(this.authService.getUserEmail())
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
          this.loadingMessage = '';
          this.errorMessage = loadingUserRepoInfoError;
        },
        () => {
          this.loadingMessage = '';
        }
      );
  }

  moveAStep() {
    this.errorMessage = '';
    if (this.showDatasource) {
      this.step1ChooseBaseUrl.submitForm();
    } else if (this.showGuidelines) {
      this.step2ChooseGuidelines.saveChanges();
      if (this.type == 'cris'){
        this.setQueryParam('crisEntities');
        this.showCrisEntities = true;
      } else {
        this.getValidationSets();
        this.setQueryParam('parameters');
        this.showParameters = true;
      }
      this.showGuidelines = false;
      this.step3 = 'active';
    } else if (this.showParameters) {
      this.step3ChooseParameters.submitChanges();
      //save all changes
      this.submitForValidation();
      this.setQueryParam('finish');
      this.showFinish = true;
      this.showParameters = false;
      this.step4 = 'active';
    } else if (this.showCrisEntities) {
      this.step3ChooseCrisEntities.saveChanges();
      //save all changes
      this.submitForValidation();
      this.showFinish = true;
      this.showCrisEntities = false;
      this.step4 = 'active';
    }
  }

  moveBackAStep () {
    if (this.showGuidelines) {
      this.setQueryParam('baseUrl');
      this.showDatasource = true;
      this.showGuidelines = false;
      this.step2 = '';
      this.errorMessage = '';
    } else if (this.showParameters) {
      this.setQueryParam('guidelines');
      this.step3 = '';
      this.showGuidelines = true;
      this.showParameters = false;
      this.errorMessage = '';
    } else if (this.showCrisEntities) {
      this.setQueryParam('guidelines');
      this.step3 = '';
      this.showGuidelines = true;
      this.showCrisEntities = false;
      this.errorMessage = '';
    }
  }

  identifyUrl() {
    this.loadingMessage = identifyingUrl;
    console.log(`identifying ${this.chosenUrl}`);
    this.valService.identifyRepository(this.chosenUrl).subscribe(
      res => {
        this.identifiedUrl = res;
        console.log(`identifyRepository responded: ${this.identifiedUrl}`);
      },
      error =>  {
        console.log(error);
        this.loadingMessage = '';
        this.identifiedUrl = false;
        this.errorMessage = noServiceMessage;
      }, () => {
        this.loadingMessage = '';
        if (this.identifiedUrl) {
          this.getRuleSetsForType();
        } else {
          this.errorMessage = invalidCustomBaseUrl;
        }
      }
    );
  }

  getRuleSetsForType() {
    this.loadingMessage = loadingRuleSets;
    this.valService.getRuleSets(this.type)
      .subscribe(
        rules => this.ruleSets = rules,
        error => {
          this.loadingMessage = '';
          this.errorMessage = loadingRuleSetsError;
        },
        () => {
          this.loadingMessage = '';
          this.showDatasource = false;
          this.step2 = 'active';
          if (this.ruleSets.length) {
            this.showGuidelines = true;
            this.setQueryParam('guidelines');
          } else {
            this.errorMessage = noRuleSets;
          }
        }
      );
  }

  getValidationSets() {
    this.loadingMessage = loadingValSets;
    this.valService.getSetsOfRepository(this.chosenUrl)
      .subscribe(
        sets => this.valSets = sets,
        error => {
          this.errorMessage = loadingValSetsError
        },
        () => {
          this.loadingMessage = '';
          this.step2 = 'active';
          this.showParameters = true;
        }
      );
  }

  getChosenUrl(url: string) {
    this.chosenUrl = url;
    this.identifyUrl();
  }

  getChosenRules(rules: any[]) {
    this.chosenGuidelinesAcronym = rules[0];
    this.chosenContentRules = rules[1];
    this.chosenUsageRules = rules[2];
  }

  getChosenParameters (params: string[]) {
    this.chosenValSet = params[0];
    this.noOfRecords = +params[1];
    this.xPath = params[2];
  }

  getChosenCrisEntities (crisParams: any[]) {
    this.chosenCrisEntities = crisParams[0];
    console.log(this.chosenCrisEntities);
    this.crisRefIntegrity = crisParams[1];
  }


  submitForValidation() {
    let isCris: boolean;
    if (this.type == 'cris') {
      isCris = true;
    } else {
      isCris = false;
      this.crisRefIntegrity = null;
      this.chosenCrisEntities = null;
    }
    let newJob: JobForValidation = {
      selectedCrisEntities: this.chosenCrisEntities,
      selectedContentRules: this.chosenContentRules,
      selectedUsageRules: this.chosenUsageRules,

      desiredCompatibilityLevel: this.chosenGuidelinesAcronym,
      baseUrl: this.chosenUrl,

      validationSet: this.chosenValSet,
      records: this.noOfRecords,
      groupByXpath: this.xPath,

      cris: isCris,
      crisReferentialChecks: this.crisRefIntegrity,

      userEmail: this.authService.getUserEmail(),

      adminEmails: [],
      officialName: '',
      datasourceId: '',
      interfaceId: '',
      activationId: '',
      repoType: '',
      interfaceIdOld: '',
      metadataPrefix: '',

      registration: false,
      updateExisting: false
    };
    console.log(JSON.stringify(newJob));
    this.valService.submitJobForValidation(newJob).subscribe(
      newJob => console.log(newJob),
      error => {
        this.errorMessage = submittingJobError;
      }
    );
  }

  setQueryParam(value: string) {
    // set param for step
    this.queryParams['step'] = value;
    this.router.navigate([], { relativeTo: this.route, queryParams: this.queryParams });
  }

}
