/*
*  created by myrto on 1/22/2018
*/

import { Component, OnInit } from '@angular/core';
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
  platformNameDesc,
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

  newDatasource: Repository;

  group: FormGroup;
  readonly groupDefinition = {
    softwarePlatform : '',
    platformName : '',
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
  platformNameDesc : Description = platformNameDesc;
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
    private repoService: RepositoryService
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
      let newRepo: Repository = {
        id: '',
        officialName: this.group.get('officialName').value,
        englishName: this.group.get('englishName').value,
        websiteUrl: this.group.get('websiteUrl').value,
        logoUrl: this.group.get('logoUrl').value,
        contactEmail: this.group.get('adminEmail').value,
        countryName: this.group.get('country').value,
        countryCode: null, //this.group.get('officialName').value,
        organization: null,
        latitude: this.group.get('latitude').value,
        longitude: this.group.get('longtitude').value,
        timezone: this.group.get('timezone').value,
        namespacePrefix: '',
        odNumberOfItems: '',
        odNumberOfItemsDate: null,
        odPolicies: '',
        odLanguages: '',
        odContentTypes: '',
        collectedFrom: '',
        inferred: null,
        deletedByInference: null,
        trust: 0,
        inferenceProvenance: '',
        dateOfValidation: null,
        datasourceClass: this.group.get('journalType').value,
        provenanceActionClass: '',
        dateOfCollection: null,
        typology: this.group.get('softwarePlatform').value,
        activationId: '',
        mergehomonyms: null,
        description: this.group.get('repoDescription').value,
        releaseStartDate: null,
        releaseEndDate: null,
        missionStatementUrl: '',
        dataProvider: null,
        serviceProvider: null,
        databaseAccessType: '',
        dataUploadType: '',
        databaseAccessRestriction: '',
        dataUploadRestriction: '',
        versioning: null,
        citationGuidelineUrl: '',
        qualityManagementKind: '',
        pidSystems: '',
        certificates: '',
        aggregator: '',
        issn: this.group.get('issn').value,
        eissn: this.group.get('eissn').value,
        lissn: this.group.get('lissn').value,
        interfaces: [],
        availableDiskSpace: '',
        securityParameters: '',
        protocol: 'oai',
        registeredBy: 'ant.lebesis@gmail.com',
        datasourceType: 'journal',
        datasourceAggregatorId: null,
        datasourceOriginalIdValue: null,
        datasourceOriginalIdProvenance: '',
        datasourceAggregated: false,
        datasourceComplianceDegreeValue: '',
        datasourceComplianceDegreeEncoding: '',
        numberOfObjects: 0,
        maxSizeOfDatastructure: 0,
        maxNumberOfDataStructures: 0,
        registered: true,
        extraFields: {  },
        piwikInfo: null,
        environments: [],
        registrationDate: null,
        verified: false,
        dataCollectionTypes: [],
        resourceId: '',
        resourceUri: '',
        resourceKind: '',
        resourceType: '',
        dateOfCreation: null,

    };
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


}
