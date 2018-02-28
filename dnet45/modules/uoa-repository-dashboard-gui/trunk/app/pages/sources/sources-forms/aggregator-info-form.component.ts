/*
*  created by myrto on 1/22/2018
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { formErrorRequiredFields, formSuccessRegisteredDatasource, noServiceMessage } from '../../../domain/shared-messages';
import { RepositoryService } from "../../../services/repository.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Repository } from '../../../domain/typeScriptClasses';
import { typologies } from '../../../domain/typologies';
import { timezones } from '../../../domain/timezones';
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
  aggregatorTypeDesc,
  adminEmailDesc
} from '../../../domain/oa-description';
import { AuthenticationService } from '../../../services/authentication.service';

@Component ({
  selector: 'aggregator-info-form',
  templateUrl: 'aggregator-info-form.component.html'
})

export class AggregatorInfoFormComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies = typologies;
  timezones = timezones;
  countries: Country[] = [];
  datasourceClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  group: FormGroup;
  readonly groupDefinition = {
    softwarePlatform : '',
    officialName : ['', Validators.required],
    repoDescription : ['', Validators.required],
    country : ['', Validators.required],
    longtitude : ['', [Validators.required, Validators.maxLength(9), Validators.min(-180), Validators.max(180)] ],
    latitude : ['', [Validators.required, Validators.maxLength(9), Validators.min(-90), Validators.max(90)] ],
    websiteUrl : ['', Validators.required],
    institutionName : ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: '',
    timezone: ['', Validators.required],
    aggregatorType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email] ]
  };

  softwarePlatformDesc : Description = softwarePlatformDesc;
  officialNameDesc : Description = officialNameDesc;
  repoDescriptionDesc : Description = repoDescriptionDesc;
  countryDesc : Description = countryDesc;
  longtitudeDesc : Description = longtitudeDesc;
  latitudeDesc : Description = latitudeDesc;
  websiteUrlDesc : Description = websiteUrlDesc;
  institutionNameDesc : Description = institutionNameDesc;
  englishNameDesc : Description = englishNameDesc;
  logoUrlDesc : Description = logoUrlDesc;
  timezoneDesc : Description = timezoneDesc;
  aggregatorTypeDesc : Description = aggregatorTypeDesc;
  adminEmailDesc : Description = adminEmailDesc;


  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm(){
    this.group = this.fb.group(this.groupDefinition);
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
    this.repoService.getDatasourceClasses('aggregator').subscribe(
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

  registerDatasource(): boolean {
    if(this.group.valid){
      let newRepo = this.createNewRepository();
      this.repoService.addRepository('aggregator', newRepo).subscribe(
        response => console.log(`${JSON.stringify(response)}`),
        error => console.log(error)
      );
      this.successMessage = formSuccessRegisteredDatasource;
      this.errorMessage = '';
      return true;
    } else {
      this.errorMessage = formErrorRequiredFields;
      return false;
    }
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
    newRepo.datasourceClass = this.group.get('journalType').value;
    newRepo.typology = this.group.get('softwarePlatform').value;
    newRepo.description = this.group.get('repoDescription').value;
    newRepo.registeredBy = this.authService.userEmail;
    newRepo.datasourceType = 'aggregator';
    newRepo.registered = true;

    this.emittedInfo.emit(newRepo);

    return newRepo;
  }

}
