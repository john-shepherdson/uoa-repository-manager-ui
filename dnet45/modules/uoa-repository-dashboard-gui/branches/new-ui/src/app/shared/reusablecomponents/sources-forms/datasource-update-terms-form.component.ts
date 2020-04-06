import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formErrorRequiredFields, formErrorWasntSaved, formSubmitting, formSuccessUpdatedRepo, loadingRepoError,
  loadingRepoMessage, noServiceMessage } from '../../../domain/shared-messages';
import { RepositoryService } from '../../../services/repository.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Country, Repository, RepositorySnippet, Timezone, Typology } from '../../../domain/typeScriptClasses';
import { Description, softwarePlatformDesc, platformNameDesc, officialNameDesc, repoDescriptionDesc, countryDesc,
  longtitudeDesc, latitudeDesc, websiteUrlDesc, institutionNameDesc, englishNameDesc, logoUrlDesc, timezoneDesc,
  datasourceTypeDesc, adminEmailDesc, lissnDesc, eissnDesc, issnDesc } from '../../../domain/oa-description';
import { AuthenticationService } from '../../../services/authentication.service';
import {Router} from '@angular/router';

@Component ({
  selector: 'datasource-update-terms-form',
  templateUrl: './datasource-update-terms-form.component.html'
})

export class DatasourceUpdateTermsFormComponent implements OnInit {

  agreementForm = this.fb.group({
    acceptTerms: '',
    optOut: ''
  });

  consentTermsOfUseDate: Date;

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  /*  in sources/register (in literature or data mode) the updated repository is emitted */
  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  @Input() showButton: boolean;

  repoId: string;
  formSubmitted = false;
  // updateGroup: FormGroup;
  termsTick: boolean;
  dataMiningTick: boolean;
  readonly updateGroupDefinition = {
    softwarePlatform : ''
  };

  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.selectedRepo);
    // this.dataMiningTick = false; // until we have an actual value
    if (this.router.url.indexOf('/sources/update') > -1) {
      console.log('up');
      this.termsTick = (this.selectedRepo.consentTermsOfUse ? (this.selectedRepo.consentTermsOfUse === 'true') : true);
      // this.addTerm(this.selectedRepo.consentTermsOfUse, this.dataMiningTick);

    } else if (this.router.url.indexOf('/sources/register') > -1) {
      console.log('reg');
      this.termsTick = true;
    }
  }

  // TODO: review updateRepo when backend is ready to POST terms
  updateRepo() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scroll(1, 1);

    if (this.agreementForm.valid) {
      if (this.showButton) {
        this.loadingMessage = formSubmitting;
        this.errorMessage = '';
        this.repoService.updateRepository(this.selectedRepo).subscribe(
          response => {
            if (response) {
              this.selectedRepo = response;
              console.log(`updateRepository responded: ${JSON.stringify(response)}`);
            }
          },
          error => {
            console.log(error);
            this.loadingMessage = '';
            this.errorMessage = formErrorWasntSaved;
          },
          () => {
            this.loadingMessage = '';
            if (!this.selectedRepo) {
              this.errorMessage = formErrorWasntSaved;
            } else {
              this.successMessage = formSuccessUpdatedRepo;
            }
          }
        );
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
    }
  }

}


