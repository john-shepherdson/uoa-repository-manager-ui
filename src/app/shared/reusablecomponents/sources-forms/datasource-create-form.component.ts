import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  adminEmailDesc,
  countryDesc,
  datasourceTypeDesc,
  Description,
  eissnDesc,
  englishNameDesc,
  institutionNameDesc,
  issnDesc,
  latitudeDesc,
  lissnDesc,
  logoUrlDesc,
  longtitudeDesc,
  officialNameDesc,
  platformNameDesc,
  repoDescriptionDesc,
  softwarePlatformDesc,
  timezoneDesc,
  websiteUrlDesc
} from '../../../domain/oa-description';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { formErrorRequiredFields, noServiceMessage } from '../../../domain/shared-messages';
import { Option } from '../../input.component';
import { checkPlatform } from './datasource-update-form.component';
import { MatStepper } from '@angular/material/stepper';

@Component ({
  selector: 'datasource-create-form',
  templateUrl: './datasource-create-form.component.html'
})

export class DatasourceCreateFormComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies: Typology[] = [];
  typologiesOptions: Option[] = [];
  timezones: Timezone[] = [];
  timezonesOptions: Option[] = [];
  countries: Country[] = [];
  countriesOptions: Option[] = [];
  datasourceClasses: Map<string, string> = new Map<string, string>();
  datasourceClassesOptions: Option[] = [];
  classCodes: string[] = [];

  @Input() mode: string;

  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  formSubmitted = false;
  group: UntypedFormGroup;

  readonly groupDefinition = {
    softwarePlatform : [null, Validators.required],
    platformName : null,
    officialName : ['', Validators.required],
    issn : ['', [Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$')] ],
    eissn : ['', Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$') ],
    lissn : ['', Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$') ],
    repoDescription : ['', Validators.required],
    country : ['', Validators.required],
    longtitude : ['', [Validators.min(-180), Validators.max(180)] ],
    latitude : ['', [Validators.min(-90), Validators.max(90)] ],
    websiteUrl : ['', [Validators.required, Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')] ],
    institutionName : ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: ['', Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$') ],
    timezone: ['', Validators.required],
    datasourceType: [null, Validators.required],
    adminEmail: ['', [Validators.required, Validators.email] ]
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

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private repoService: RepositoryService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    if (!this.mode) {
      this.mode = this.route.snapshot.url[0].path.toString();
      console.log(`my mode is ${this.mode}`);
    }
    this.group = this.fb.group(this.groupDefinition, {validator: checkPlatform});

    this.group.get('platformName').disable();
    this.group.get('softwarePlatform').valueChanges.subscribe({
      next: (value) => {
        if (value === 'Other') {
          this.group.get('platformName').enable();
          this.group.get('platformName').setValidators([Validators.required]);
          this.group.updateValueAndValidity();
        } else {
          this.group.get('platformName').clearValidators();
          this.group.updateValueAndValidity();
          this.group.get('platformName').reset();
          this.group.get('platformName').disable();
        }
      }
    });
    if (this.mode === 'journal') {
      this.group.get('issn').clearValidators();
      this.group.get('issn').setValidators([Validators.required, Validators.pattern('^(\\d{4}-?\\d{3}[\\dxX])$')]);
    }
    this.getTypologies();
    this.getTimezones();
    this.getCountries();
    this.getDatasourceClasses();

    if (this.selectedRepo) {
      this.setupForm();
    }
  }

  setupForm() {
    if (this.selectedRepo) {
      console.log(`my datasource type is: ${this?.selectedRepo?.eoscDatasourceType}`);

      this.group.setValue({
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
        datasourceType: this.selectedRepo.eoscDatasourceType, // TODO: still needed? should it be typology? typology exists on that stage?
        adminEmail: this.selectedRepo.contactemail
      });

      if (this.selectedRepo.eoscDatasourceType === 'Journal archive') {

        let ssnToShow = this.selectedRepo.issn.slice(0, 4) + '-' + this.selectedRepo.issn.toString().slice(4);
        this.group.get('issn').setValue(ssnToShow);

        if (this.selectedRepo.eissn.trim().length) {
          ssnToShow = this.selectedRepo.eissn.slice(0, 4) + '-' + this.selectedRepo.eissn.toString().slice(4);
          this.group.get('eissn').setValue(ssnToShow);
        }

        if (this.selectedRepo.lissn.trim().length) {
          ssnToShow = this.selectedRepo.lissn.slice(0, 4) + '-' + this.selectedRepo.lissn.toString().slice(4);
          this.group.get('lissn').setValue(ssnToShow);
        }

      }
    }
  }

  getCountries() {
    this.repoService.getCountries().subscribe(
      countries => {
        this.countries = countries.sort( function(a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        });
        this.countriesOptions = [];
        this.countries.forEach(country => {
          this.countriesOptions.push({value: country.code, label: country.name});
        });
      },
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      });
  }

  getDatasourceClasses() {
    this.repoService.getDatasourceClasses(this.mode).subscribe(
      classes => {
        for (const [key, value] of Object.entries(classes)) {
          this.datasourceClasses.set(key, value);
          this.datasourceClassesOptions.push({value: key, label: value});
        }
      },
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        this.classCodes = Array.from(this.datasourceClasses.keys());
      }
    );
  }

  getTypologies() {
    this.repoService.getTypologies().subscribe({
      next: value => {
        this.typologies = value;
        this.typologiesOptions = [];
        this.typologies.forEach(typology => {
          this.typologiesOptions.push({value: typology.value, label: typology.name});
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getTimezones() {
    this.repoService.getTimezones().subscribe(
      zones => {
        this.timezones = zones;
        this.timezonesOptions = [];
        zones.forEach(zone => {
          this.timezonesOptions.push({value: zone.offset, label: zone.name});
        });
      },
      error => console.log(error)
    );
  }

  registerDatasource(stepper?: MatStepper) {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scroll(1, 1);

    if (this.group.valid) {
      this.selectedRepo = this.createNewRepository();
      stepper.next();
      this.emittedInfo.emit(this.selectedRepo);
    } else {
      this.errorMessage = formErrorRequiredFields;
    }
  }

  createNewRepository(): Repository {
    const newRepo = new Repository();
    newRepo.officialname = this.group.get('officialName').value.toString();
    newRepo.englishname = this.group.get('englishName').value.toString();
    newRepo.websiteurl = this.group.get('websiteUrl').value;
    newRepo.logourl = this.group.get('logoUrl').value;
    newRepo.contactemail = this.group.get('adminEmail').value;
    newRepo.organizations.push({
      legalshortname: null,
      legalname: this.group.get('institutionName').value.toString(),
      websiteurl: null,
      logourl: null,
      country: this.group.get('country').value
    });
    newRepo.latitude = this.group.get('latitude').value;
    newRepo.longitude = this.group.get('longtitude').value;
    newRepo.timezone = this.group.get('timezone').value;
    if (this.group.get('softwarePlatform').value !== 'Other') {
      newRepo.platform = this.group.get('softwarePlatform').value;
    } else if (this.group.get('platformName').value) {
      newRepo.platform = this.group.get('platformName').value;
    }
    newRepo.typology = this.group.get('datasourceType').value;
    newRepo.description = this.group.get('repoDescription').value.toString();
    newRepo.issn = '';
    newRepo.eissn = '';
    newRepo.lissn = '';

    if ( this.group.get('issn').value ) {
      let ssnParts = this.group.get('issn').value.split('-');
      let correctSSN = ssnParts[0] + ssnParts[1];
      newRepo.issn = correctSSN;
      if ( this.group.get('eissn').value ) {
        ssnParts = this.group.get('eissn').value.split('-');
        correctSSN = ssnParts[0] + ssnParts[1];
        newRepo.eissn = correctSSN;
      }
      if ( this.group.get('lissn').value ) {
        ssnParts = this.group.get('lissn').value.split('-');
        correctSSN = ssnParts[0] + ssnParts[1];
        newRepo.lissn = correctSSN;
      }
    }

    newRepo.registeredby = this.authService.getUserEmail();

    newRepo.eoscDatasourceType = this.mode; // keep this
    newRepo.managed = true;

    const now = new Date(Date.now());
    newRepo.consentTermsOfUseDate = now;
    newRepo.lastConsentTermsOfUseDate = now;
    newRepo.registrationdate = now;
    return newRepo;
  }


}
