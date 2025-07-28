import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formErrorRequiredFields, formErrorWasntSaved, formSubmitting, formSuccessUpdatedRepo, loadingRepoError,
  loadingRepoMessage, noServiceMessage } from '../../../domain/shared-messages';
import { RepositoryService } from '../../../services/repository.service';
import {AbstractControl, FormArray, UntypedFormBuilder, FormGroup, Validators} from '@angular/forms';
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
    textMining: ''
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
  readonly updateGroupDefinition = {
    softwarePlatform : ''
  };

  constructor(
    private fb: UntypedFormBuilder,
    private repoService: RepositoryService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.agreementForm.get('acceptTerms').setValue(this.selectedRepo.consentTermsOfUse ? this.selectedRepo.consentTermsOfUse : false);
    this.agreementForm.get('textMining').setValue(this.selectedRepo.fullTextDownload ? this.selectedRepo.fullTextDownload : false);
    this.selectedRepo.consentTermsOfUse = this.agreementForm.value.acceptTerms;
    this.selectedRepo.fullTextDownload = this.agreementForm.value.textMining;
    // if (this.router.url.indexOf('/sources/update') > -1) {
    //   console.log('update');
    // } else
      if (this.router.url.indexOf('/sources/register') > -1) {
      this.emitRepo();
    }
  }

  emitRepo() {
    this.selectedRepo.consentTermsOfUse = this.agreementForm.value.acceptTerms;
    this.selectedRepo.fullTextDownload = this.agreementForm.value.textMining;
    this.emittedInfo.emit(this.selectedRepo);
  }

  updateRepo() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scroll(1, 1);

    if (this.agreementForm.valid) {
      if (this.showButton) {
        this.loadingMessage = formSubmitting;
        this.errorMessage = '';
        this.selectedRepo.consentTermsOfUse = this.agreementForm.value.acceptTerms;
        this.selectedRepo.fullTextDownload = this.agreementForm.value.textMining;
        if (!this.selectedRepo.consentTermsOfUseDate) {
          this.selectedRepo.consentTermsOfUseDate = new Date(Date.now());
        }
        this.selectedRepo.lastConsentTermsOfUseDate = new Date(Date.now());
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


