/*
*  created by myrto on 1/22/2018
*/

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  formErrorInvalidFields, formErrorRequiredFields, formErrorWasntSaved, formSubmitting, formSuccessRegisteredDatasource,
  noServiceMessage
} from '../../../domain/shared-messages';
import { RepositoryService } from "../../../services/repository.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
import { typologies } from '../../../domain/typologies';
import { timezones } from '../../../domain/timezones';
import {
  Description,
  softwarePlatformDesc,
  officialNameDesc,
  issnDesc,
  eissnDesc,
  lissnDesc,
  repoDescriptionDesc,
  countryDesc,
  longtitudeDesc,
  latitudeDesc,
  websiteUrlDesc,
  institutionNameDesc,
  englishNameDesc,
  logoUrlDesc,
  timezoneDesc,
  journalTypeDesc,
  aggregatorTypeDesc,
  adminEmailDesc
} from '../../../domain/oa-description';
import { ValidatorService } from '../../../services/validator.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute } from '@angular/router';

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
  datasourceClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  mode: string;

  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  group: FormGroup;
  readonly groupDefinition = {
    softwarePlatform : '',
    officialName : ['', Validators.required],
    issn : ['', [Validators.minLength(8), Validators.maxLength(8)]],
    eissn : ['', [Validators.minLength(8), Validators.maxLength(8)]],
    lissn : ['', [Validators.minLength(8), Validators.maxLength(8)]],
    repoDescription : ['', Validators.required],
    country : ['', Validators.required],
    longtitude : ['', [Validators.required, Validators.min(-180), Validators.max(180)] ],
    latitude : ['', [Validators.required, Validators.min(-90), Validators.max(90)] ],
    websiteUrl : ['', Validators.required],
    institutionName : ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: '',
    timezone: ['', Validators.required],
    datasourceType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email] ]
  };

  softwarePlatformDesc : Description = softwarePlatformDesc;
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
  datasourceTypeDesc : Description;
  adminEmailDesc : Description = adminEmailDesc;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private repoService: RepositoryService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm(){
    this.mode = this.route.snapshot.url[0].path.toString();
    if (this.mode == 'journal') {
      this.datasourceTypeDesc = journalTypeDesc;
    } else if (this.mode == 'aggregator') {
      this.datasourceTypeDesc = aggregatorTypeDesc;
    }
    console.log(this.mode);
    this.group = this.fb.group(this.groupDefinition);
    this.getTypologies();
    this.getTimezones();
    this.getCountries();
    this.getDatasourceClasses();
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
        for (let key in this.datasourceClasses){
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

  registerDatasource(): boolean {
    let result: boolean;

    this.errorMessage = '';
    this.successMessage = '';

    if (this.group.valid) {
      if ( this.mode != 'journal' || this.group.get('issn').value ) {
        let newRepo = this.createNewRepository();
        this.loadingMessage = formSubmitting;
        this.errorMessage = '';
        this.repoService.addRepository(newRepo.datasourceType, newRepo).subscribe(
          response => {
            console.log(`addRepository responded:\n${JSON.stringify(response)}`);
            if (response) {
              result = true;
            }
          },
          error => {
            console.log(error);
            this.loadingMessage = '';
            this.errorMessage = formErrorWasntSaved;
            result = false;
          },
          () => {
            this.loadingMessage = '';
            if (result) {
              this.successMessage = formSuccessRegisteredDatasource;
              this.emittedInfo.emit(newRepo);
            } else {
              this.errorMessage = formErrorWasntSaved;
            }
          }
        );
      } else {
        result = false;
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      result = false;
    }
    return result;
  }

  createNewRepository(): Repository {
    let newRepo: Repository = new Repository();
    newRepo.dateOfCreation = new Date(Date.now());
    newRepo.officialName = this.group.get('officialName').value;
    newRepo.englishName = this.group.get('englishName').value;
    newRepo.websiteUrl = this.group.get('websiteUrl').value;
    newRepo.logoUrl = this.group.get('logoUrl').value;
    newRepo.contactEmail = this.group.get('adminEmail').value;
    newRepo.countryName = this.countries.filter(x => x.code == this.group.get('country').value)[0].name;
    newRepo.countryCode = this.group.get('country').value;
    newRepo.organization = this.group.get('institutionName').value;
    newRepo.latitude = this.group.get('latitude').value;
    newRepo.longitude = this.group.get('longtitude').value;
    newRepo.timezone = this.group.get('timezone').value;
    newRepo.datasourceClass = this.group.get('datasourceType').value;
    newRepo.typology = this.group.get('softwarePlatform').value;
    newRepo.description = this.group.get('repoDescription').value;
    newRepo.issn = this.group.get('issn').value;
    newRepo.eissn = this.group.get('eissn').value;
    newRepo.lissn = this.group.get('lissn').value;
    newRepo.registeredBy = this.authService.userEmail;
    newRepo.datasourceType = this.mode;
    newRepo.registered = true;

    return newRepo;
  }


}
