/*
*  created by myrto on 1/22/2018
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  formErrorInvalidFields, formErrorRequiredFields, formErrorWasntSaved, formSuccessRegisteredDatasource,
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
  adminEmailDesc
} from '../../../domain/oa-description';
import { ValidatorService } from '../../../services/validator.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component ({
  selector: 'journal-info-form',
  templateUrl: 'journal-info-form.component.html'
})

export class JournalInfoFormComponent implements OnInit {
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
    issn : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    eissn : ['', [Validators.minLength(8), Validators.maxLength(8)]],
    lissn : ['', [Validators.minLength(8), Validators.maxLength(8)]],
    repoDescription : ['', Validators.required],
    country : ['', Validators.required],
    longtitude : ['', [Validators.required, Validators.maxLength(9), Validators.min(-180), Validators.max(180)] ],
    latitude : ['', [Validators.required, Validators.maxLength(9), Validators.min(-90), Validators.max(90)] ],
    websiteUrl : ['', Validators.required],
    institutionName : ['', Validators.required],
    englishName: ['', Validators.required],
    logoUrl: '',
    timezone: ['', Validators.required],
    journalType: ['', Validators.required],
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
  journalTypeDesc : Description = journalTypeDesc;
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
    this.repoService.getDatasourceClasses('journal').subscribe(
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
      this.repoService.addRepository('journal',newRepo).subscribe(
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

  updateEnglishName(id: string, name: string) {
    let status: boolean;
    this.repoService.updateEnglishName(id,name).subscribe(
      response => {
        console.log(`answered ${response}`);
        status = true;
      },
      error => {
        console.log(error);
        this.errorMessage = formErrorWasntSaved;
        status = false;
      }
    );
    console.log(status);
    return status;
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
    newRepo.issn = this.group.get('issn').value;
    newRepo.eissn = this.group.get('eissn').value;
    newRepo.lissn = this.group.get('lissn').value;
    newRepo.registeredBy = this.authService.userEmail;
    newRepo.datasourceType = 'journal';
    newRepo.registered = true;

    this.emittedInfo.emit(newRepo);

    return newRepo;
  }


}
