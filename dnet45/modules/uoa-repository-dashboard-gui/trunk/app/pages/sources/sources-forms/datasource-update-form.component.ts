import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  formErrorRequiredFields,
  formErrorWasntSaved,
  formSubmitting,
  formSuccessUpdatedRepo, loadingRepoError, loadingRepoMessage,
  noServiceMessage
} from '../../../domain/shared-messages';
import { RepositoryService } from "../../../services/repository.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
import {
  Description,
  softwarePlatformDesc,
  platformNameDesc,
  officialNameDesc,
  repoDescriptionDesc,
  countryDesc,
  longtitudeDesc,
  latitudeDesc,
  websiteUrlDesc,
  institutionNameDesc,
  englishNameDesc,
  logoUrlDesc,
  timezoneDesc,
  datasourceTypeDesc,
  journalTypeDesc,
  aggregatorTypeDesc,
  adminEmailDesc, lissnDesc, eissnDesc, issnDesc
} from '../../../domain/oa-description';
import { ConfirmationDialogComponent } from '../../../shared/reusablecomponents/confirmation-dialog.component';
import {AuthenticationService} from "../../../services/authentication.service";

@Component ({
  selector: 'datasource-update-form',
  templateUrl: './datasource-update-form.component.html'
})

export class DatasourceUpdateFormComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies: Typology[] = [];
  timezones: Timezone[] = [];
  countries: Country[] = [];
  datasourceClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  isModalShown: boolean;
  @ViewChild('updateLogoUrlModal')
  public updateLogoUrlModal: ConfirmationDialogComponent;

  /* in sources/update emits the new logoUrl */
  @Output() emittedUrl: EventEmitter<string> = new EventEmitter();

  /*  in sources/register (of literature or data repository) emits the updated repository */
  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  @Input() showButton: boolean;

  formSubmitted:boolean = false;
  updateGroup: FormGroup;
  readonly updateGroupDefinition = {
    softwarePlatform : '',
    platformName : '',
    officialName : '',
    issn : '',
    eissn : '',
    lissn : '',
    repoDescription : ['', Validators.required],
    country : '',
    longtitude : '',
    latitude : '',
    websiteUrl : [''],
    institutionName : [''],
    englishName: ['', Validators.required],
    logoUrl: ['', Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$') ],
    timezone: ['', Validators.required],
    datasourceType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email]]
  };

  softwarePlatformDesc : Description = softwarePlatformDesc;
  platformNameDesc : Description = platformNameDesc;
  officialNameDesc : Description = officialNameDesc;
  issnDesc : Description = issnDesc;
  eissnDesc : Description = eissnDesc;
  lissnDesc : Description = lissnDesc;
  repoDescriptionDesc : Description = repoDescriptionDesc;
  countryDesc : Description = countryDesc;
  longtitudeDesc : Description = longtitudeDesc;
  latitudeDesc : Description = latitudeDesc;
  websiteUrlDesc : Description = websiteUrlDesc;
  institutionNameDesc : Description = institutionNameDesc;
  englishNameDesc : Description = englishNameDesc;
  logoUrlDesc : Description = logoUrlDesc;
  timezoneDesc : Description = timezoneDesc;
  datasourceTypeDesc : Description = datasourceTypeDesc;
  adminEmailDesc : Description = adminEmailDesc;

  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(){
    this.loadForm();
  }

  loadForm() {
    if (this.selectedRepo) {
      this.loadingMessage = loadingRepoMessage;
      this.updateGroup = this.fb.group(this.updateGroupDefinition, {validator: checkPlatform});
      this.setupUpdateForm();
      //this.getDatasourceClasses();
      //this.getCountries();
      this.getTypologies();
      this.getTimezones();
    } else {
      this.errorMessage = loadingRepoError;
    }
  }

  setupUpdateForm(){
    if (this.selectedRepo) {
      console.log(`my datasource type is: ${this.selectedRepo.datasourceType}`);
      /*if (this.selectedRepo.datasourceType == 'journal') {
        this.datasourceTypeDesc = journalTypeDesc;
      } else if (this.selectedRepo.datasourceType == 'aggregator') {
        this.datasourceTypeDesc = aggregatorTypeDesc;
      } else {
        this.datasourceTypeDesc = datasourceTypeDesc;
      }*/
      this.updateGroup.setValue({
        softwarePlatform: this.selectedRepo.typology,
        platformName: '',
        officialName: this.selectedRepo.officialName,
        issn: '',
        eissn: '',
        lissn: '',
        repoDescription: this.selectedRepo.description,
        country: this.selectedRepo.countryCode,
        longtitude: this.selectedRepo.longitude,
        latitude: this.selectedRepo.latitude,
        websiteUrl: this.selectedRepo.websiteUrl,
        institutionName: this.selectedRepo.organization,
        englishName: this.selectedRepo.englishName,
        logoUrl: this.selectedRepo.logoUrl,
        timezone: this.selectedRepo.timezone,
        datasourceType: this.selectedRepo.datasourceClass,
        adminEmail: this.selectedRepo.contactEmail
      });
      if ( !this.updateGroup.get('softwarePlatform').value ) {
        this.updateGroup.get('softwarePlatform').setValue('');
        this.updateGroup.get('platformName').setValue(this.selectedRepo.typology);
      }
      this.updateGroup.get('officialName').disable();
      this.updateGroup.get('country').disable();
      this.updateGroup.get('longtitude').disable(); // MAYBE NOT DISABLED
      this.updateGroup.get('latitude').disable();   // MAYBE NOT DISABLED
      this.updateGroup.get('websiteUrl').disable();
      this.updateGroup.get('institutionName').disable();
      if (this.selectedRepo.datasourceType == 'journal') {

        let ssnToShow = this.selectedRepo.issn.slice(0, 4)+ '-' + this.selectedRepo.issn.toString().slice(4);
        this.updateGroup.get('issn').setValue(ssnToShow);

        if (this.selectedRepo.eissn.trim().length) {
          ssnToShow = this.selectedRepo.eissn.slice(0, 4)+ '-' + this.selectedRepo.eissn.toString().slice(4);
          this.updateGroup.get('eissn').setValue(ssnToShow);
        }

        if (this.selectedRepo.lissn.trim().length) {
          ssnToShow = this.selectedRepo.lissn.slice(0, 4)+ '-' + this.selectedRepo.lissn.toString().slice(4);
          this.updateGroup.get('lissn').setValue(ssnToShow);
        }

        this.updateGroup.get('issn').disable();
        this.updateGroup.get('eissn').disable();
        this.updateGroup.get('lissn').disable();
      }
      this.getDatasourceClasses();
    }
  }

  getDatasourceClasses() {
    this.repoService.getDatasourceClasses(this.selectedRepo.datasourceType).subscribe(
      classes => this.datasourceClasses = classes,
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        for (let key in this.datasourceClasses){
          this.classCodes.push(key);
        }
        this.getCountries();
      }
    );
  }

  getCountries(){
    this.repoService.getCountries()
      .subscribe(
        countries => this.countries = countries.sort( function(a,b){
          if(a.name<b.name){
            return -1;
          } else if(a.name>b.name){
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          this.loadingMessage = '';
          this.errorMessage = noServiceMessage;
          console.log(error);
        }, () => {
          this.getTypologies();
        });
  }

  getTypologies() {
    this.repoService.getTypologies().subscribe(
      types => this.typologies = types,
      error => {
        this.loadingMessage = '';
        console.log(error);
      },
      () => this.getTimezones()
    );
  }

  getTimezones() {
    this.repoService.getTimezones().subscribe(
      zones => this.timezones = zones,
      error => {
        this.loadingMessage = '';
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
      }
    );
  }

  updateRepo() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.updateGroup.valid) {
      if ( this.selectedRepo.datasourceType != 'journal' || this.updateGroup.get('issn').value ) {
        this.refreshSelectedRepo();

        /*
          call the api only if the current page is sources/update
          [otherwise the repository will be updated during the registration procedure, after the first interface is saved]
        */
        if (this.showButton) {
          this.loadingMessage = formSubmitting;
          this.errorMessage = '';
          this.repoService.updateRepository(this.selectedRepo).subscribe(
            response => {
              if (response) {
                this.selectedRepo = response;
                console.log(`updateRepository responded: ${JSON.stringify(response)}`);
                this.emittedInfo.emit(response);
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
    } else {
      this.errorMessage = formErrorRequiredFields;
    }
  }

  refreshSelectedRepo() {
    if (this.updateGroup.get('platformName').value ) {
      this.selectedRepo.typology = this.updateGroup.get('platformName').value;
    } else if (this.updateGroup.get('softwarePlatform').value) {
      this.selectedRepo.typology = this.updateGroup.get('softwarePlatform').value;
    }
    this.selectedRepo.officialName = this.updateGroup.get('officialName').value;
    this.selectedRepo.description = this.updateGroup.get('repoDescription').value;
    this.selectedRepo.countryCode = this.updateGroup.get('country').value;
    this.selectedRepo.countryName = this.countries.filter(x => x.code == this.updateGroup.get('country').value)[0].name;
    this.selectedRepo.longitude = this.updateGroup.get('longtitude').value;
    this.selectedRepo.latitude = this.updateGroup.get('latitude').value;
    this.selectedRepo.websiteUrl = this.updateGroup.get('websiteUrl').value;
    this.selectedRepo.organization = this.updateGroup.get('institutionName').value;
    this.selectedRepo.englishName = this.updateGroup.get('englishName').value;
    this.selectedRepo.logoUrl = this.updateGroup.get('logoUrl').value;
    this.selectedRepo.timezone = this.updateGroup.get('timezone').value;
    this.selectedRepo.datasourceClass = this.updateGroup.get('datasourceType').value;
    this.selectedRepo.contactEmail = this.updateGroup.get('adminEmail').value;
    if (this.selectedRepo.datasourceType == 'journal') {
      let ssnParts = this.updateGroup.get('issn').value.split('-');
      let correctSSN = ssnParts[0]+ssnParts[1];
      this.selectedRepo.issn = correctSSN;
      if ( this.updateGroup.get('eissn').value ) {
        ssnParts = this.updateGroup.get('eissn').value.split('-');
        correctSSN = ssnParts[0]+ssnParts[1];
        this.selectedRepo.eissn = correctSSN;
      }
      if ( this.updateGroup.get('lissn').value ) {
        ssnParts = this.updateGroup.get('lissn').value.split('-');
        correctSSN = ssnParts[0]+ssnParts[1];
        this.selectedRepo.lissn = correctSSN;
      }
    }
    if (!this.showButton) {
      this.selectedRepo.registeredBy = this.authService.getUserEmail();
      this.selectedRepo.registered = true;
      /*this.selectedRepo.registrationDate = new Date(Date.now());*/ //NOT NEEDED
      this.emittedInfo.emit(this.selectedRepo);
    }
  }

  changeLogoUrl(logoUrl: string) {
    this.updateGroup.get('logoUrl').setValue(logoUrl);
  }

  updateLogoUrl(logoUrl: string){
    this.updateLogoUrlModal.ids = [logoUrl];
    this.updateLogoUrlModal.showModal();
  }

  updatedLogoUrl(event: any) {
    this.emittedUrl.emit(this.updateGroup.get('logoUrl').value);
  }

}

export function checkPlatform(c: AbstractControl) {
  if ( c.get('softwarePlatform').value || c.get('platformName').value )
    return null;
  return 'invalid';
}

export function markPlatformAsRequired(c: AbstractControl) {
  c.get('platformName').setValidators([Validators.required]);
}
