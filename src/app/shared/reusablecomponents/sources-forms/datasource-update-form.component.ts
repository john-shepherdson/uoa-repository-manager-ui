import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  formErrorRequiredFields, formErrorWasntSaved, formSubmitting, formSuccessUpdatedRepo, loadingRepoError, loadingRepoMessage,
  noServiceMessage
} from '../../../domain/shared-messages';
import { RepositoryService } from '../../../services/repository.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
import {
  adminEmailDesc, countryDesc, datasourceTypeDesc, Description, eissnDesc, englishNameDesc, institutionNameDesc,
  issnDesc, latitudeDesc, lissnDesc, logoUrlDesc, longtitudeDesc, officialNameDesc, platformNameDesc, repoDescriptionDesc,
  softwarePlatformDesc, timezoneDesc, websiteUrlDesc
} from '../../../domain/oa-description';
import { AuthenticationService } from '../../../services/authentication.service';
import { SharedService } from '../../../services/shared.service';
import { Option } from '../../input.component';

@Component ({
  selector: 'datasource-update-form',
  templateUrl: './datasource-update-form.component.html'
})

export class DatasourceUpdateFormComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies: Typology[] = [];
  typologiesOptions: Option[] = [];
  timezones: Timezone[] = [];
  countries: Country[] = [];
  countriesOptions: Option[] = [];
  datasourceClasses: Map<string, string> = new Map<string, string>();
  classCodes: string[] = [];

  /*  in sources/register (in literature or data mode) the updated repository is emitted */
  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  @Input() mode: string;

  @Input() showButton: boolean;

  repoId: string;
  formSubmitted = false;
  updateGroup: UntypedFormGroup;
  readonly updateGroupDefinition = {
    softwarePlatform : '',
    platformName : '',
    officialName :  ['', Validators.required],
    issn : ['', [Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$')] ],
    eissn : ['', Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$') ],
    lissn : ['', Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$') ],
    repoDescription : ['', Validators.required],
    country : '',
    longtitude : '',
    latitude : '',
    websiteUrl : [''],
    institutionName :  ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: ['', Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$') ],
    timezone: ['', Validators.required],
    datasourceType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email]]
  };

  softwarePlatformDesc: Description = softwarePlatformDesc;
  platformNameDesc: Description = platformNameDesc;
  officialNameDesc: Description = officialNameDesc;
  issnDesc: Description = issnDesc;
  eissnDesc: Description = eissnDesc;
  lissnDesc: Description = lissnDesc;
  repoDescriptionDesc: Description = repoDescriptionDesc;
  countryDesc: Description = countryDesc;
  longtitudeDesc: Description = longtitudeDesc;
  latitudeDesc: Description = latitudeDesc;
  websiteUrlDesc: Description = websiteUrlDesc;
  institutionNameDesc: Description = institutionNameDesc;
  englishNameDesc: Description = englishNameDesc;
  logoUrlDesc: Description = logoUrlDesc;
  timezoneDesc: Description = timezoneDesc;
  datasourceTypeDesc: Description = datasourceTypeDesc;
  adminEmailDesc: Description = adminEmailDesc;

  constructor(private fb: UntypedFormBuilder, private repoService: RepositoryService, private sharedService: SharedService,
              private authService: AuthenticationService) {}

  ngOnInit() {
    this.loadForm();
    // console.log('mode: ', this.mode);
  }

  loadForm() {
    if (this.selectedRepo) {
      this.repoId = this.selectedRepo.id.split('::')[1];
      this.loadingMessage = loadingRepoMessage;
      this.updateGroup = this.fb.group(this.updateGroupDefinition, {validator: checkPlatform});
      this.updateGroup.get('repoDescription').disable();
      this.updateGroup.get('softwarePlatform').valueChanges.subscribe({
        next: (value) => {
          if (value === '') {
            this.updateGroup.get('repoDescription').enable();
          } else {
            this.updateGroup.get('repoDescription').disable();
          }
        }
      });
      this.getDatasourceClasses();
    } else {
      this.errorMessage = loadingRepoError;
    }
  }

  setupUpdateForm() {
    if (this.selectedRepo) {

      this.updateGroup.setValue({
        softwarePlatform: this.selectedRepo.platform,
        platformName: '',
        officialName: this.selectedRepo.officialname,
        issn: '',
        eissn: '',
        lissn: '',
        repoDescription: this.selectedRepo.description,
        country: this.selectedRepo.organizations[0].country, // countryCode
        longtitude: this.selectedRepo.longitude,
        latitude: this.selectedRepo.latitude,
        websiteUrl: this.selectedRepo.websiteurl,
        institutionName: this.selectedRepo.organizations[0].legalname,
        englishName: this.selectedRepo.englishname,
        logoUrl: this.selectedRepo.logourl,
        timezone: this.selectedRepo.timezone,
        datasourceType: this.selectedRepo.typology, // TODO: rename to typology?
        adminEmail: this.selectedRepo.contactemail
      });

      if ( this.selectedRepo.platform === '' || !this.typologies.some(x => x.value === this.selectedRepo.platform) ) {
        this.updateGroup.get('softwarePlatform').setValue('');
        this.updateGroup.get('platformName').setValue(this.selectedRepo.platform);
      }

      if (this.selectedRepo.eoscDatasourceType === 'Journal archive') {
        console.log('inside journal');
        this.updateGroup.get('issn').setValue(this.selectedRepo.issn);
        this.updateGroup.get('eissn').setValue(this.selectedRepo.eissn);
        this.updateGroup.get('lissn').setValue(this.selectedRepo.lissn);
      }

      // FIXME: Use eoscDatasourceType when we support the new model
      if ((this.mode === 'opendoar') || (this.mode === 're3data')) {

        this.updateGroup.get('country').disable();
      }

      // FIXME: Use eoscDatasourceType when we support the new model
      if (this.mode === 'cris') {
        // this.longtitudeDesc.mandatory = false;
        // this.latitudeDesc.mandatory = false;
        this.datasourceTypeDesc.label = 'CRIS scope/type';
      } else {
        // this.longtitudeDesc.mandatory = true;
        // this.latitudeDesc.mandatory = true;
        this.datasourceTypeDesc.label = 'Data source type';
      }

      // FIXME: Use eoscDatasourceType when we support the new model
      if (this.mode === 'journal') {
        console.log(this.mode);

        let ssnToShow = this.selectedRepo.issn.slice(0, 4) + '-' + this.selectedRepo.issn.toString().slice(4);
        this.updateGroup.get('issn').setValue(ssnToShow);
        this.updateGroup.get('issn').clearValidators();
        this.updateGroup.get('issn').setValidators([Validators.required, Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$')]);

        if (this.selectedRepo.eissn.trim().length) {
          ssnToShow = this.selectedRepo.eissn.slice(0, 4) + '-' + this.selectedRepo.eissn.toString().slice(4);
          this.updateGroup.get('eissn').setValue(ssnToShow);
        }

        if (this.selectedRepo.lissn.trim().length) {
          ssnToShow = this.selectedRepo.lissn.slice(0, 4) + '-' + this.selectedRepo.lissn.toString().slice(4);
          this.updateGroup.get('lissn').setValue(ssnToShow);
        }

        /* it was decided that all fields will be open, 21-12-2018 */
        /*this.updateGroup.get('issn').disable();
        this.updateGroup.get('eissn').disable();
        this.updateGroup.get('lissn').disable();*/
      }
    }
  }

  getDatasourceClasses() {
    // FIXME: Use eoscDatasourceType when we support the new model

    let param = this.selectedRepo.collectedfrom.split('::')[1];
    if (this.selectedRepo.eoscDatasourceType === 'Journal archive') { param = 'journal'; }
    if (this.selectedRepo.eoscDatasourceType === 'Aggregator') { param = 'aggregator'; }

    this.repoService.getDatasourceClasses(param).subscribe(
      classes => {
        for (const [key, value] of Object.entries(classes)) {
          this.datasourceClasses.set(key, value);
        }},
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        console.log('gotDatasourceClasses');
        this.classCodes = Array.from(this.datasourceClasses.keys());
        this.getCountries();
      }
    );
  }

  getCountries() {
    this.repoService.getCountries().subscribe(
        countries => this.countries = countries.sort( function(a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }),
        error => {
          this.loadingMessage = '';
          this.errorMessage = noServiceMessage;
          console.log(error);
        },
        () => {
          this.countriesOptions = [];
          this.countries.forEach(country => {
            this.countriesOptions.push({value: country.code, label: country.name});
          });
          this.getTypologies();
        });
  }

  getTypologies() {
    this.repoService.getTypologies().subscribe(
      types => {
        this.typologies = types;
        this.getTypologiesAsOptions();
      },
      error => {
        this.loadingMessage = '';
        console.log(error);
      },
      () => {
        this.getTimezones();
      }
    );
  }

  getTypologiesAsOptions() {
    console.log('getTypologiesAsOptions');

    this.typologiesOptions = [];
    for (const typology of this.typologies) {
      const option: Option = new Option();
      option.value = typology.value;
      option.label = typology.name;
      this.typologiesOptions.push(option);
    }
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
        this.setupUpdateForm();
      }
    );
  }

  updateRepo() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scroll(1, 1);

    if (this.updateGroup.valid) {
      if ( this.selectedRepo.eoscDatasourceType !== 'journal' || this.updateGroup.get('issn').value ) {
        this.refreshSelectedRepo();

        /*
          call the api only if the current page is sources/update
          [otherwise the repository will be updated during the registration procedure, after the first interface is saved]
        */
        if (this.showButton) {
          this.loadingMessage = formSubmitting;
          this.errorMessage = '';
          // this.repoService.up
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
              // fixme is this the place to update the subject??
              this.sharedService.setRepository(this.selectedRepo);
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
    if (this.updateGroup.get('softwarePlatform').value ) {
      this.selectedRepo.platform = this.updateGroup.get('softwarePlatform').value;
    } else if (this.updateGroup.get('platformName').value) {
      this.selectedRepo.platform = this.updateGroup.get('platformName').value;
    }
    this.selectedRepo.typology = this.updateGroup.get('datasourceType').value;
    console.log('typology ', this.selectedRepo.typology);
    console.log(this.datasourceClasses);
    console.log(this.updateGroup.get('datasourceType').value);
    this.selectedRepo.officialname = this.updateGroup.get('officialName').value.toString();
    this.selectedRepo.description = this.updateGroup.get('repoDescription').value.toString();
    this.selectedRepo.organizations[0].country = this.updateGroup.get('country').value; // countryCode
    this.selectedRepo.longitude = this.updateGroup.get('longtitude').value;
    this.selectedRepo.latitude = this.updateGroup.get('latitude').value;
    this.selectedRepo.websiteurl = this.updateGroup.get('websiteUrl').value;
    this.selectedRepo.organizations[0].legalname = this.updateGroup.get('institutionName').value.toString();
    this.selectedRepo.englishname = this.updateGroup.get('englishName').value.toString();
    this.selectedRepo.logourl = this.updateGroup.get('logoUrl').value;
    this.selectedRepo.timezone = this.updateGroup.get('timezone').value;
    this.selectedRepo.contactemail = this.updateGroup.get('adminEmail').value;
    if (this.selectedRepo.eoscDatasourceType === 'journal') {
      let ssnParts = this.updateGroup.get('issn').value.split('-');
      let correctSSN = ssnParts[0] + ssnParts[1];
      this.selectedRepo.issn = correctSSN;
      if ( this.updateGroup.get('eissn').value ) {
        ssnParts = this.updateGroup.get('eissn').value.split('-');
        correctSSN = ssnParts[0] + ssnParts[1];
        this.selectedRepo.eissn = correctSSN;
      }
      if ( this.updateGroup.get('lissn').value ) {
        ssnParts = this.updateGroup.get('lissn').value.split('-');
        correctSSN = ssnParts[0] + ssnParts[1];
        this.selectedRepo.lissn = correctSSN;
      }
    }
    if (!this.showButton) { // on register
      this.selectedRepo.registeredby = this.authService.getUserEmail();
      this.selectedRepo.managed = true;
      const now = new Date(Date.now());
      this.selectedRepo.consentTermsOfUseDate = now;
      this.selectedRepo.lastConsentTermsOfUseDate = now;
      this.selectedRepo.registrationdate = now;
      this.emittedInfo.emit(this.selectedRepo);
    }
  }

}

export function checkPlatform(c: AbstractControl) {
  if ( c.get('softwarePlatform').value || c.get('platformName').value ) {
    return null;
  }
  return 'invalid';
}
