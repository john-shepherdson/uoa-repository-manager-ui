import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adminEmailDesc, countryDesc, datasourceTypeDesc, Description, eissnDesc, englishNameDesc, institutionNameDesc,
         issnDesc, latitudeDesc, lissnDesc, logoUrlDesc, longtitudeDesc, officialNameDesc, repoDescriptionDesc,
         softwarePlatformDesc, timezoneDesc, websiteUrlDesc } from '../../../domain/oa-description';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { formErrorRequiredFields, noServiceMessage } from '../../../domain/shared-messages';

@Component ({
  selector: 'datasource-create-form',
  templateUrl: './datasource-create-form.component.html'
})

export class DatasourceCreateFormComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies: Typology[] = [];
  timezones: Timezone[] = [];
  countries: Country[] = [];
  datasourceClasses: Map<string, string> = new Map<string, string>();
  classCodes: string[] = [];

  @Input() mode: string;

  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  formSubmitted = false;
  group: FormGroup;

  // old issn regex
  // issn : ['', [Validators.pattern('^\\d\\d\\d\\d[-]\\d\\d\\d\\d$')] ],
  readonly groupDefinition = {
    softwarePlatform : ['', Validators.required],
    officialName : ['', Validators.required],
    issn : ['', [Validators.pattern('^\\d{4}-\\d{3}[\\dxX]$')] ],
    eissn : ['', Validators.pattern('^\\d{4}-\\d{3}[\\dxX]$') ],
    lissn : ['', Validators.pattern('^\\d{4}-\\d{3}[\\dxX]$') ],
    repoDescription : ['', Validators.required],
    country : ['', Validators.required],
    longtitude : ['', [Validators.required, Validators.min(-180), Validators.max(180)] ],
    latitude : ['', [Validators.required, Validators.min(-90), Validators.max(90)] ],
    websiteUrl : ['', [Validators.required, Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')] ],
    institutionName : ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: ['', Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$') ],
    timezone: ['', Validators.required],
    datasourceType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email] ]
  };

  softwarePlatformDesc: Description = softwarePlatformDesc;
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
    private fb: FormBuilder,
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
    this.group = this.fb.group(this.groupDefinition);
    if (this.mode === 'journal') {
      this.group.get('issn').clearValidators();
      this.group.get('issn').setValidators([Validators.required, Validators.pattern('^\\d{4}-\\d{3}[\\dxX]$')]);
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
      console.log(`my datasource type is: ${this.selectedRepo.datasourceType}`);

      this.group.setValue({
        softwarePlatform: this.selectedRepo.typology,
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

      if (this.selectedRepo.datasourceType === 'journal') {

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
    this.repoService.getCountries()
      .subscribe(
        countries => this.countries = countries.sort( function(a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          this.errorMessage = noServiceMessage;
          console.log(error);
        });
  }

  getDatasourceClasses() {
    this.repoService.getDatasourceClasses(this.mode).subscribe(
      classes => this.datasourceClasses = classes,
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        for (const key of Object.keys(this.datasourceClasses)) {
          this.classCodes.push(key);
        }
      }
    );
  }

  getTypologies() {
    this.repoService.getTypologies().subscribe(
      types => this.typologies = types,
      error => console.log(error)
    );
  }

  getTimezones() {
    this.repoService.getTimezones().subscribe(
      zones => this.timezones = zones,
      error => console.log(error)
    );
  }

  registerDatasource() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scroll(1, 1);

    if (this.group.valid) {
      this.selectedRepo = this.createNewRepository();
      this.emittedInfo.emit(this.selectedRepo);
    } else {
      this.errorMessage = formErrorRequiredFields;
    }
  }

  createNewRepository(): Repository {
    const newRepo: Repository = new Repository();
    newRepo.officialName = encodeURI(this.group.get('officialName').value);
    newRepo.englishName = encodeURI(this.group.get('englishName').value);
    newRepo.websiteUrl = this.group.get('websiteUrl').value;
    newRepo.logoUrl = this.group.get('logoUrl').value;
    newRepo.contactEmail = this.group.get('adminEmail').value;
    newRepo.countryName = this.countries.filter(x => x.code === this.group.get('country').value)[0].name;
    newRepo.countryCode = this.group.get('country').value;
    newRepo.organization = encodeURI(this.group.get('institutionName').value);
    newRepo.latitude = this.group.get('latitude').value;
    newRepo.longitude = this.group.get('longtitude').value;
    newRepo.timezone = this.group.get('timezone').value;
    newRepo.datasourceClass = this.group.get('datasourceType').value;
    newRepo.typology = this.group.get('softwarePlatform').value;
    newRepo.description = encodeURI(this.group.get('repoDescription').value);
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

    newRepo.registeredBy = this.authService.getUserEmail();

    /* THE BELOW FIELDS ARE NOT SET IN GWT CODE*/
    newRepo.datasourceType = this.mode;
    newRepo.dateOfCreation = new Date(Date.now()); // NOT NEEDED ??
    newRepo.registered = true;
    newRepo.registrationDate = new Date(Date.now()); // NOT NEEDED ??

    return newRepo;
  }


}
