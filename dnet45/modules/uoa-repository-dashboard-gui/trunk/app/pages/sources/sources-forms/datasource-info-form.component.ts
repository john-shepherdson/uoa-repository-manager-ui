import { Component, Input, OnInit } from '@angular/core';
import {
  formErrorRequiredFields,
  formErrorWasntSaved,
  formInfoLoading,
  formSuccessUpdatedRepo,
  noServiceMessage
} from '../../../domain/shared-messages';
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
  loadingMessage: string;
  sourceTitle: string;
  sourceLinkToRepo: string;

  typologies = typologies;
  timezones = timezones;
  countries: Country[] = [];
  datasourceClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  selectedRepo: Repository;
  id: string;
  source: string;


  @Input() datasourceId: string;

  @Input() showButton: boolean;

  updateGroup: FormGroup;
  readonly updateGroupDefinition = {
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
    datasourceType: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email]]
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
    this.loadForm();
  }

  getRepo() {
    this.loadingMessage = formInfoLoading;
    if (this.datasourceId) {
      this.repoService.getRepositoryById(this.datasourceId).subscribe(
        repo => {
          this.selectedRepo = repo;
          if (this.selectedRepo) {
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
              datasourceType: this.selectedRepo.datasourceClass,
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

          this.setUpSourceInfo();
          this.getDatasourceClasses();
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
        },
        () => {
          this.getCountries();
          this.loadingMessage = '';
        }
      );
    }
  }

  setUpSourceInfo() {
    this.id = this.selectedRepo.id.split("::").pop();
    this.source = this.selectedRepo.id.split("_")[0];
    console.log(this.source);

    if(this.source == 'opendoar') {
      this.sourceTitle = 'OpenDOAR';
      this.sourceLinkToRepo = `http://www.opendoar.org/suggest.php?rID=${this.id}`;
    } else if(this.source == 're3data') {
      this.sourceTitle = 'Re3data';
      this.sourceLinkToRepo = `http://service.re3data.org/repository/${this.id}`;
    }
  }


  loadForm() {
    this.updateGroup = this.fb.group(this.updateGroupDefinition);
    this.getRepo();
  }


  updateRepo(): boolean {
    if(this.updateGroup.valid){
/*
        if (!this.updateEnglishName()) {
          return false;
        }
*/
        this.successMessage = formSuccessUpdatedRepo;
        this.errorMessage = '';
        return true;
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
      return false;
    }
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
    this.repoService.getDatasourceClasses(this.source).subscribe(
      classes => this.datasourceClasses = classes,
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        for (let key in this.datasourceClasses){
          this.classCodes.push(key);
/*          console.log(`${key} -> ${this.datasourceClasses[key]}`);*/
        }
      }
    );
  }

  updateEnglishName(){
    let status: boolean;
    this.repoService.updateEnglishName(this.selectedRepo.id,this.updateGroup.get('englishName').value).subscribe(
      response => {
        console.log(response);
        status = true;
      },
      error => {
        console.log(error);
        this.errorMessage = formErrorWasntSaved;
        status = false;
      }
    );
    return status;
  }

}
