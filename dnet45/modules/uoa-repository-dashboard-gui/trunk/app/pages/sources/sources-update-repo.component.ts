import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';
import { Country, Repository, RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import {
  Description,
  interfaceFormDesc,
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
} from '../../domain/oa-description';



@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  repoId = '';
  selectedRepo: Repository;
  countries: Country[];
  repoInterfaces: RepositoryInterface[] = [];

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces : Type<any> = UpdateDatasourceInterfaceFormComponent;

  interfaceDummyList = [
    {
      baseUrl: 'WWW.FDGLKSDJFGLKDJSF.GR',
      selectValidationSet: 'blabla',
      compatibilityLevel: 'moreblabla'
    },
    {
      baseUrl: 'WWW.FDGLKSDJFGLKDJSfdgdfgF.GR',
      selectValidationSet: 'blabla2',
      compatibilityLevel: 'blabla1'
    }
  ];

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


  constructor (
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private route: ActivatedRoute )
  {}


  ngOnInit() {
    this.readRepoId();
    this.loadUpdateTab();
    this.loadInterfacesTab();

  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
  }

  getRepo() {
    this.repoService.getRepositoryById(this.repoId).subscribe(
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

  getRepoInterfaces() {
    this.repoService.getRepositoryInterface(this.repoId).subscribe(
      interfaces => { this.repoInterfaces = interfaces; console.log(this.repoInterfaces.length)},
      error => console.log(error)
    );
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
    //set initial values
  }

  loadInterfacesTab() {
    this.getRepoInterfaces();
    this.group = this.fb.group({});
/*
    setTimeout(() => {
      console.log("PATCHING");
      this.repoInterfaces.forEach(item => {
        this.group.patchValue({
          baseUrl : item.baseUrl,
          selectValidationSet : item.accessSet,
          compatibilityLevel : item.desiredCompatibilityLevel
        });
      });
    },1000);
*/
  }

}
