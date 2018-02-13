import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { RepositoryService } from '../../services/repository.service';
import { InterfaceInformation, Repository, RuleSet } from '../../domain/typeScriptClasses';
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
  ruleSets: RuleSet[] = [];
  valSets: string[] = [];
  chosenInterface: InterfaceInformation;

  chosenUrl: string;
  chosenValSet: string;
  noOfRecords: number;
  xPath: string;

  errorMessage: string;
  loadingMessage: string;

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

  moveAStep() {
    let stepValidation: boolean;
    if (this.showDatasource) {
      stepValidation = this.step1ChooseBaseUrl.submitForm();
      if (stepValidation) {
        this.getRuleSetsForType();
        console.log(`The chosenUrl is: ${this.chosenUrl} !!`);
      }
    } else if (this.showGuidelines) {
      this.step2ChooseGuidelines.saveChanges();
      this.getInterfaceInfo();
      //this.getValidationSets();
      this.showParameters = true;
      this.showGuidelines = false;
      this.step3 = 'active';
    } else if (this.showParameters) {
      this.step3ChooseParameters.submitChanges();
      //save all changes
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
      this.errorMessage = '';
    } else if (this.showParameters) {
      this.step3 = '';
      this.showGuidelines = true;
      this.showParameters = false;
      this.errorMessage = '';
    }
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
          this.showDatasource = true;
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
          } else {
            this.errorMessage = noRuleSets;
          }
        }
      );
  }

  getInterfaceInfo() {
    this.loadingMessage = loadingValSets;
    this.valService.getInterfaceInformation(this.chosenUrl).subscribe(
      info => this.chosenInterface = info,
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = loadingValSetsError;
      },
      () => {
        this.loadingMessage = '';
        this.step3 = 'active';
        this.showParameters = true;
        if (this.chosenInterface) {
          this.valSets = this.chosenInterface.sets;
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
  }

  getParameters (params: string[]) {
    this.chosenValSet = params[0];
    this.noOfRecords = +params[1];
    this.xPath = params[2];
  }

  submitForValidation(){
    /*
    * selectedCrisEntities  string[]
    * selectedContentRules number[]
    * selectedUsageRules number[]
    *
    * validationSet
    * records
    * groupByXpath
    *
    * adminEmails string[]
    * officialName
    * baseUrl
    * userEmail
    * datasourceId
    * interfaceId
    * desiredCompatibilityLevel
    * activationId
    * repoType
    * interfaceIdOld
    * metadataPrefix
    *
    * registration boolean
    * updateExisting boolean
    * cris boolean
    * crisReferentialChecks boolean
    */
  }

}
