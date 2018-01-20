import { Component, Input, OnInit } from '@angular/core';
import { formErrorRequiredFields, formInfoLoading, formSuccessUpdatedRepo } from '../../../domain/shared-messages';
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
  showSpinner: boolean;
  loadingMessage: string;
  sourceTitle: string;
  sourceLinkToRepo: string;

  selectedRepo: Repository;

  @Input() datasourceId: string;

  @Input() showButton: boolean;

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
    this.showSpinner = true;
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

          this.setUpSourceInfo();
        },
        error => console.log(error),
        () => {
          this.showSpinner = false;
        }
      );
    }
  }

  setUpSourceInfo() {
    let id: string;
    let source: string;
    id = this.selectedRepo.id.split("::").pop();
    source = this.selectedRepo.id.split("_")[0];
    console.log(source);

    if(source == 'opendoar') {
      this.sourceTitle = 'OpenDOAR';
      this.sourceLinkToRepo = `http://www.opendoar.org/suggest.php?rID=${id}`;
    } else if(source == 're3data') {
      this.sourceTitle = 'Re3data';
      this.sourceLinkToRepo = `http://service.re3data.org/repository/${id}`;
    }
  }


  loadForm() {
    this.updateGroup = this.fb.group(this.updateGroupDefinition);
    this.getRepo();
  }


  updateRepo(): boolean {
    if(this.updateGroup.valid){
      this.successMessage = formSuccessUpdatedRepo;
      this.errorMessage = '';
      return true;
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
      return false;
    }
  }

}
