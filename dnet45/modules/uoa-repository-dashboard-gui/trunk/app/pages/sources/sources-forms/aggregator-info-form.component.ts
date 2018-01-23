/*
*  created by myrto on 1/22/2018
*/

import { Component, OnInit } from '@angular/core';
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

@Component ({
  selector: 'aggregator-info-form',
  templateUrl: 'aggregator-info-form.component.html'
})

export class AggregatorInfoFormComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  typologies = typologies;
  timezones = timezones;
  countries: Country[] = [];

  newDatasource: Repository;

  group: FormGroup;
  readonly groupDefinition = {
    softwarePlatform : '',
    platformName : '',
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
  platformNameDesc : Description = platformNameDesc;
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
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.group = this.fb.group(this.groupDefinition);
    this.getCountries();
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

  registerDatasource(): boolean {
    if(this.group.valid){
      this.successMessage = formSuccessRegisteredDatasource;
      this.errorMessage = '';
      return true;
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
      return false;
    }
  }

}
