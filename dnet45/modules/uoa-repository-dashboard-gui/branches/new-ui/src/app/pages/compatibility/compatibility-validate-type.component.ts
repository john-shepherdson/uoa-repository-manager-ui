import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { RepositoryService } from '../../services/repository.service';
import { JobForValidation, RuleSet } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import { didntSelectCrisEntities, didntSelectRules, identifyingUrl, invalidCustomBaseUrl,
         loadingReposMessage, loadingRuleSets, loadingRuleSetsError, loadingUserRepoInfoError,
         loadingValSets, loadingValSetsError, noRuleSets, noServiceMessage, submittingJobError
} from '../../domain/shared-messages';
import { ValidatorService } from '../../services/validator.service';
import { CompatibilityValidateStep2Component } from './compatibility-validate-forms/compatibility-validate-step2.component';
import { CompatibilityValidateStep3Component } from './compatibility-validate-forms/compatibility-validate-step3.component';
import { CompatibilityValidateStep3CrisComponent } from './compatibility-validate-forms/compatibility-validate-step3-cris.component';
import { AsideHelpContentComponent, HelpContentComponent } from '../../shared/reusablecomponents/help-content.component';

@Component ({
  selector: 'compatibility-validate-literature',
  templateUrl: 'compatibility-validate-type.component.html'
})

export class CompatibilityValidateTypeComponent implements OnInit {
  type = '';

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'baseUrl','guidelines','crisEntities'/'parameters','finish'
   */
  currentStep: number;
  @ViewChild('topHelperContent')
  public topHelperContent: HelpContentComponent;
  @ViewChild('leftHelperContent')
  public leftHelperContent: AsideHelpContentComponent;
  @ViewChild('rightHelperContent')
  public rightHelperContent: AsideHelpContentComponent;
  @ViewChild('bottomHelperContent')
  public bottomHelperContent: HelpContentComponent;

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

  @ViewChild('step1ChooseBaseUrl') step1ChooseBaseUrl: CompatibilityValidateStep1Component;
  @ViewChild('step2ChooseGuidelines') step2ChooseGuidelines: CompatibilityValidateStep2Component;
  @ViewChild('step3ChooseParameters') step3ChooseParameters: CompatibilityValidateStep3Component;
  @ViewChild('step3ChooseCrisEntities') step3ChooseCrisEntities: CompatibilityValidateStep3CrisComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService,
              private repoService: RepositoryService,
              private valService: ValidatorService) {}

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('type')) {
      this.type = this.route.snapshot.paramMap.get('type');
      this.getBaseUrlList();
      this.route.queryParams.subscribe(
        () => this.getStep()
      );
    }
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
  }

  getStep() {
    this.currentStep = 0;
    if (this.route.snapshot.queryParamMap.has('step')) {
      const stepName = this.route.snapshot.queryParamMap.get('step');
      if (stepName === 'guidelines') {
        if (!this.identifiedUrl) {
          this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=baseUrl`);
        } else {
          this.currentStep = 1;
        }
      } else if ((stepName === 'parameters') || (stepName === 'crisEntities')) {
        if (!this.chosenUrl) {
          this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=baseUrl`);
        } else {
          this.currentStep = 2;
        }
      } else if (stepName === 'finish') {
        this.currentStep = 3;
      }
    }
    this.rightHelperContent.ngOnInit();
    this.topHelperContent.ngOnInit();
    this.leftHelperContent.ngOnInit();
    this.bottomHelperContent.ngOnInit();
  }

  /* retrieves the baseUrl list for the registered repositories of the user */
  getBaseUrlList() {
    this.loadingMessage = loadingReposMessage;
    this.repoService.getUrlsOfUserRepos(this.authService.getUserEmail())
      .subscribe(
        repos => this.baseUrlList = repos.sort( function(a , b) {
          if (a < b ) {
            return -1;
          } else if (a > b ) {
            return 1;
          } else {
            return 0;
          }
        }),
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingUserRepoInfoError;
          window.scroll(1, 1);
        },
        () => {
          this.loadingMessage = '';
        }
      );
  }

  moveAStep() {
    this.errorMessage = '';
    if (this.currentStep === 0) {
      this.step1ChooseBaseUrl.submitForm();
    } else if (this.currentStep === 1) {
      this.step2ChooseGuidelines.saveChanges();
      console.log(this.chosenContentRules);
      if (this.chosenContentRules.length || this.chosenUsageRules.length) {
        if (this.type === 'cris') {
          this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=crisEntities`);
        } else {
          this.getValidationSets();
          this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=parameters`);
        }
      } else {
        this.errorMessage = didntSelectRules;
        window.scroll(1, 1);
      }
    } else if ((this.currentStep === 2) && (this.type !== 'cris')) {
      this.step3ChooseParameters.submitChanges();
      // save all changes
      this.submitForValidation();
    } else if ((this.currentStep === 2) && (this.type === 'cris')) {
      this.step3ChooseCrisEntities.saveChanges();
      if (this.chosenCrisEntities.length) {
        // save all changes
        this.submitForValidation();
      } else {
        this.errorMessage = didntSelectCrisEntities;
        window.scroll(1, 1);
      }
    }
  }

  moveBackAStep () {
    this.errorMessage = '';
    if (this.currentStep === 1) {
      this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=baseUrl`);
    } else if ((this.currentStep === 2) && (this.type !== 'cris')) {
      this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=guidelines`);
    } else if ((this.currentStep === 2) && (this.type === 'cris')) {
      this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=guidelines`);
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
        window.scroll(1, 1);
      }, () => {
        this.loadingMessage = '';
        if (this.identifiedUrl) {
          this.getRuleSetsForType();
        } else {
          this.errorMessage = invalidCustomBaseUrl;
          window.scroll(1, 1);
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
          window.scroll(1, 1);
        },
        () => {
          this.loadingMessage = '';
          if (this.ruleSets && this.ruleSets.length) {
            this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=guidelines`);
          } else {
            this.errorMessage = noRuleSets;
            window.scroll(1, 1);
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
          this.errorMessage = loadingValSetsError;
          window.scroll(1, 1);
        },
        () => {
          this.loadingMessage = '';
          this.currentStep = 2;
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
    if (this.type === 'cris') {
      isCris = true;
      this.chosenValSet = 'none';
      this.noOfRecords = -1;
    } else {
      isCris = false;
      this.crisRefIntegrity = null;
      this.chosenCrisEntities = null;
    }

    const newJob: JobForValidation = {
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
      job => console.log(JSON.stringify(job)),
      error => {
        this.errorMessage = submittingJobError;
        window.scroll(1, 1);
      },
      () => {
        this.router.navigateByUrl(`/compatibility/validate/${this.type}?step=finish`);
      }
    );
  }

}
