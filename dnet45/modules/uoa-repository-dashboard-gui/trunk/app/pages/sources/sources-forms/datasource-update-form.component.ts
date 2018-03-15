import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  formErrorRequiredFields,
  formErrorWasntSaved,
  formSubmitting,
  formSuccessUpdatedRepo,
  noServiceMessage
} from '../../../domain/shared-messages';
import { RepositoryService } from "../../../services/repository.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Repository, Timezone, Typology } from '../../../domain/typeScriptClasses';
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
  journalTypeDesc,
  aggregatorTypeDesc,
  adminEmailDesc, lissnDesc, eissnDesc, issnDesc
} from '../../../domain/oa-description';
import { ConfirmationDialogComponent } from '../../../shared/reusablecomponents/confirmation-dialog.component';

@Component ({
  selector: 'datasource-update-form',
  templateUrl: './datasource-update-form.component.html'
})

export class DatasourceUpdateFormComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  typologies: Typology[] = [];
  timezones: Timezone[] = [];
  countries: Country[] = [];
  datasourceClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  @ViewChild('updateLogoUrlModal')
  public updateLogoUrlModal: ConfirmationDialogComponent;

  /* in sources/update emits the new logUrl */
  @Output() emittedUrl: EventEmitter<string> = new EventEmitter();

  /*  in sources/register (of literature or data repository) emits the updated repository */
  @Output() emittedInfo: EventEmitter<Repository> = new EventEmitter();

  @Input() selectedRepo: Repository;

  @Input() showButton: boolean;

  updateGroup: FormGroup;
  readonly updateGroupDefinition = {
    softwarePlatform : '',
    platformName : '',
    officialName : ['', Validators.required],
    issn : ['', Validators.minLength(8)],
    eissn : ['', Validators.minLength(8)],
    lissn : ['', Validators.minLength(8)],
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
    adminEmail: ['', [Validators.required, Validators.email]]
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
  datasourceTypeDesc : Description;
  adminEmailDesc : Description = adminEmailDesc;

  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService
  ) {}

  ngOnInit(){
    this.loadForm();
  }

  loadForm() {
    this.updateGroup = this.fb.group(this.updateGroupDefinition, {validator: checkPlatform});
    this.setupUpdateForm();
    this.getDatasourceClasses();
    this.getCountries();
    this.getTypologies();
    this.getTimezones();
  }

  setupUpdateForm(){
    if (this.selectedRepo) {
      if (this.selectedRepo.datasourceType == 'journal') {
        this.datasourceTypeDesc = journalTypeDesc;
      } else if (this.selectedRepo.datasourceType == 'aggregator') {
        this.datasourceTypeDesc = aggregatorTypeDesc;
      } else {
        this.datasourceTypeDesc = datasourceTypeDesc;
      }
      this.updateGroup.setValue({
        softwarePlatform: this.selectedRepo.typology,
        platformName: '',
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
      if ( this.typologies.filter(x => x.value == this.updateGroup.get('softwarePlatform').value) == [] ) {
        this.updateGroup.get('softwarePlatform').setValue('');
        this.updateGroup.get('platformName').setValue(this.selectedRepo.typology);
      }
      this.updateGroup.get('officialName').disable();
      this.updateGroup.get('country').disable();
      this.updateGroup.get('longtitude').disable(); // MAYBE NOT DISABLED
      this.updateGroup.get('latitude').disable();   // MAYBE NOT DISABLED
      this.updateGroup.get('websiteUrl').disable();
      this.updateGroup.get('institutionName').disable();
      if (this.selectedRepo.datasourceType == 'journal') {
        this.updateGroup.get('issn').setValue(this.selectedRepo.issn);
        this.updateGroup.get('issn').disable();
        this.updateGroup.get('eissn').setValue(this.selectedRepo.eissn);
        this.updateGroup.get('eissn').disable();
        this.updateGroup.get('lissn').setValue(this.selectedRepo.lissn);
        this.updateGroup.get('lissn').disable();
      }
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
    this.repoService.getDatasourceClasses(this.selectedRepo.datasourceType).subscribe(
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

  updateRepo(): boolean {
    let result: boolean;

    this.errorMessage = '';
    this.successMessage = '';

    if (this.updateGroup.valid) {
      if ( this.selectedRepo.datasourceType != 'journal' || this.updateGroup.get('issn').value ) {
        this.refreshSelectedRepo();
        this.loadingMessage = formSubmitting;
        this.errorMessage = '';
        this.repoService.updateRepository(this.selectedRepo).subscribe(
          response => {
            console.log(`updateRepository responded: ${response}`);
            result = (response == '200');
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
              this.emittedInfo.emit(this.selectedRepo);
              this.successMessage = formSuccessUpdatedRepo;
            } else {
              this.errorMessage = formErrorWasntSaved;
            }
          }
        );
      } else {
        this.errorMessage = formErrorRequiredFields;
        result = false;
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      result = false;
    }
    return result;
  }

  refreshSelectedRepo() {
    if (this.updateGroup.get('platformName').value.trim() ) {
      this.selectedRepo.typology = this.updateGroup.get('platformName').value;
    } else if (this.updateGroup.get('softwarePlatform').value){
      this.selectedRepo.typology = this.updateGroup.get('softwarePlatform').value;
    }
    this.selectedRepo.officialName = this.updateGroup.get('officialName').value;
    this.selectedRepo.description = this.updateGroup.get('repoDescription').value;
    this.selectedRepo.countryCode = this.updateGroup.get('country').value;
    this.selectedRepo.countryName = this.countries.filter(x => x.code == this.updateGroup.get('country').value)[0].name;
    this.selectedRepo.longitude = this.updateGroup.get('longtitude').value;
    this.selectedRepo.latitude = this.updateGroup.get('latitude').value;
    this.selectedRepo.websiteUrl = this.updateGroup.get('websiteUrl').value;
    this.selectedRepo.organization = this.updateGroup.get('institutionName').value;
    this.selectedRepo.englishName = this.updateGroup.get('englishName').value;
    this.selectedRepo.logoUrl = this.updateGroup.get('logoUrl').value;
    this.selectedRepo.timezone = this.updateGroup.get('timezone').value;
    this.selectedRepo.datasourceClass = this.updateGroup.get('datasourceType').value;
    this.selectedRepo.contactEmail = this.updateGroup.get('adminEmail').value;
    if (this.selectedRepo.datasourceType == 'journal') {
        this.selectedRepo.issn = this.updateGroup.get('issn').value;
        this.selectedRepo.eissn = this.updateGroup.get('eissn').value;
        this.selectedRepo.lissn = this.updateGroup.get('lissn').value;
    }
  }

  changeLogoUrl(logoUrl: string) {
    this.updateGroup.get('logoUrl').setValue(logoUrl);
  }

  updateLogoUrl(logoUrl: string){
    this.updateLogoUrlModal.ids = [logoUrl];
    this.updateLogoUrlModal.showModal();
  }

  updatedLogoUrl() {
    this.emittedUrl.emit(this.updateGroup.get('logoUrl').value);
  }

}

export function checkPlatform(c: AbstractControl) {
  if ( c.get('softwarePlatform').value || c.get('platformName').value )
    return null;
  return 'invalid';
}
