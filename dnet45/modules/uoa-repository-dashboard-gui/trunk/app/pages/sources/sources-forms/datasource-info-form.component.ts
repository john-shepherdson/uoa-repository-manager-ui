import { Component, Input, OnInit } from '@angular/core';
import { formErrorRequiredFields, formSuccessUpdatedRepo } from '../../../domain/shared-messages';
import { RepositoryService } from "../../../services/repository.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Repository } from '../../../domain/typeScriptClasses';
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
  adminEmailDesc
} from '../../../domain/oa-description';

@Component ({
  selector: 'datasource-info-form',
  templateUrl: './datasource-info-form.component.html'
})

export class DatasourceInfoFormComponent implements OnInit {

  errorMessage: string;
  successMessage: string;

  selectedRepo: Repository;
  countries: Country[];

  @Input() datasourceId: string;

  updateGroup: FormGroup;
  readonly updateGroupDefinition = {
    softwarePlatform : '',
    platformName : '',
    officialName : '',
    repoDescription : '',
    country : '',
    longtitude : '',
    latitude : '',
    websiteUrl : '',
    institutionName : '',
    englishName: ['', Validators.required],
    logoUrl: '',
    timezone: ['', Validators.required],
    datasourceType: ['', Validators.required],
    adminEmail: ['', Validators.required]
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
  datasourceTypeDesc : Description = datasourceTypeDesc;
  adminEmailDesc : Description = adminEmailDesc;

  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService
  ) {}

  ngOnInit(){
    this.loadUpdateTab();
  }

  getRepo() {
    this.repoService.getRepositoryById(this.datasourceId).subscribe(
      repo => {
        this.selectedRepo = repo;
        if(this.selectedRepo) {
          this.updateGroup.setValue({
            softwarePlatform: '', //this.selectedRepo.WHICH FIELD ??
            platformName: this.selectedRepo.typology,
            officialName: this.selectedRepo.officialName,
            repoDescription: this.selectedRepo.description,
            country: this.selectedRepo.countryCode,
            longtitude: this.selectedRepo.longitude,
            latitude: this.selectedRepo.latitude,
            websiteUrl: this.selectedRepo.websiteUrl,
            institutionName: this.selectedRepo.organization,
            englishName: this.selectedRepo.englishName,
            logoUrl: this.selectedRepo.logoUrl,
            timezone: this.selectedRepo.timezone,
            datasourceType: this.selectedRepo.datasourceType,
            adminEmail: this.selectedRepo.contactEmail
          });
        }
        this.updateGroup.get('softwarePlatform').disable();
        this.updateGroup.get('platformName').disable();
        this.updateGroup.get('officialName').disable();
        this.updateGroup.get('repoDescription').disable();
        this.updateGroup.get('country').disable();
        this.updateGroup.get('longtitude').disable();
        this.updateGroup.get('latitude').disable();
        this.updateGroup.get('websiteUrl').disable();
        this.updateGroup.get('institutionName').disable();
      },
      error =>console.log(error)
    )
  }

  getCountries() {
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
        error => console.log(error)
      );
  }

  loadUpdateTab() {
    this.updateGroup = this.fb.group(this.updateGroupDefinition);
    this.getCountries();
    this.getRepo();
  }


  updateRepo(){
    if(this.updateGroup.valid){
      this.successMessage = formSuccessUpdatedRepo;
      this.errorMessage = '';
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

}
