import { Component, Injector, OnDestroy } from '@angular/core';
import { MyGroup } from '../../../shared/reusablecomponents/forms/my-group.interface';
import { FormBuilder, Validators } from '@angular/forms';
import {
  formErrorRequiredFields, formErrorWasntSaved, formInfoLoading, formSubmitting, formSuccessAddedInterface,
  formSuccessUpdatedInterface,
  invalidCustomBaseUrl, noServiceMessage
} from '../../../domain/shared-messages';
import { ValidatorService } from '../../../services/validator.service';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { InterfaceInformation, Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import {
  baseUrlDesc, compatibilityLevelDesc, customValSetDesc, Description,
  existingValSetDesc
} from '../../../domain/oa-description';

@Component ({
  selector: 'datasource-interface-form',
  templateUrl: './datasource-interface-form.component.html'
})

export class DatasourceInterfaceFormComponent extends MyGroup implements OnDestroy {

  loadingMessage: string;
  successMessage: string;
  errorMessage: string;

  currentRepository: Repository;
  oldInterface: boolean;

  identifiedBaseUrl: boolean;
  existingValSet: boolean;
  interfaceInfo: InterfaceInformation;
  currentInterface: RepositoryInterface;
  valsetList: string[] = [];

  compClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required]
  };
  baseUrlDesc: Description = baseUrlDesc;
  existingValSetDesc: Description = existingValSetDesc;
  customValSetDesc: Description = customValSetDesc;
  compatibilityLevelDesc: Description = compatibilityLevelDesc;

  constructor(injector: Injector,
              private valService: ValidatorService,
              private repoService: RepositoryService){
    super(injector);
  }

  ngOnInit() {
    this.currentRepository = <Repository>this.otherData;
    this.getCompatibilityClasses();
    console.log(`other data is: ${JSON.stringify(this.otherData)}`);
    if (this.data && this.data.length) {
      this.currentInterface = this.data[0];
      this.patchData.next({
          baseUrl: this.data[0].baseUrl,
          selectValidationSet: '',
          customValidationSet: '',
          compatibilityLevel:this.data[0].desiredCompatibilityLevel
      });
      this.getInterfaceInfo(this.data[0].baseUrl);
      this.data.splice(0,1);
      this.oldInterface = true;
    }

    /* initializes MyGroup parent component and the FormGroup */
    super.ngOnInit();
    console.log(this.group, this.parentGroup);
    if (this.currentInterface) {
      this.getMyControl('baseUrl').disable();
    }
    this.existingValSet = true;
    this.getMyControl('customValidationSet').disable();
  }

  chooseValSet(existingValSet: boolean) {
     if(existingValSet) {
       this.existingValSet = true;
       this.getMyControl('selectValidationSet').enable();
       this.getMyControl('customValidationSet').disable();
     }  else {
       this.existingValSet = false;
       this.getMyControl('selectValidationSet').disable();
       this.getMyControl('customValidationSet').enable();
     }
  }

  getInterfaceInfo(baseUrl: string) {
    this.successMessage = '';
    this.errorMessage = '';
    this.loadingMessage = formInfoLoading;
    if(baseUrl) {
      this.valService.getInterfaceInformation(baseUrl).subscribe(
        info => {
          this.interfaceInfo = info;
          if (this.interfaceInfo.identified) {
            this.identifiedBaseUrl = true;
          } else {
            this.errorMessage = invalidCustomBaseUrl;
          }
          if (this.interfaceInfo.sets) {
            this.valsetList = this.interfaceInfo.sets;
            console.log(this.valsetList);
          }
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.identifiedBaseUrl = false;
          this.errorMessage = noServiceMessage;
        },
        () => this.loadingMessage = ''
      );
    }
  }

  getCompatibilityClasses() {
    this.repoService.getCompatibilityClasses(this.currentRepository.datasourceType).subscribe(
      classes => {
        this.compClasses = classes;
        for (let key in this.compClasses){
          this.classCodes.push(key);
        }
      },
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      }
    );
  }

  saveInterface() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.group.valid && ( this.getMyControl('selectValidationSet').value || this.getMyControl('customValidationSet').value ) ) {
      if (this.identifiedBaseUrl) {
        let baseUrl = this.getMyControl('baseUrl').value;
        let valset: string = '';
        if (this.getMyControl('selectValidationSet').enabled) {
          valset = this.getMyControl('selectValidationSet').value;
        } else {
          valset = this.getMyControl('customValidationSet').value;
        }
        let compLvl = this.getMyControl('compatibilityLevel').value;

        if (this.currentInterface) {
          this.updateCurrent(baseUrl,valset,compLvl);
        } else {
          this.addCurrent(baseUrl,valset,compLvl);
        }
      } else {
        this.errorMessage = invalidCustomBaseUrl;
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

  updateCurrent (baseUrl: string, valset: string, compLvl: string) {
    this.successMessage = '';
    this.errorMessage = '';
    this.loadingMessage = formSubmitting;
    this.currentInterface.baseUrl = baseUrl;
    this.currentInterface.accessSet = valset;
    this.currentInterface.desiredCompatibilityLevel = compLvl;
    this.currentInterface.typology = this.currentRepository.datasourceClass;
    this.repoService.updateInterface(this.currentInterface).subscribe(
      response => {
        console.log(`updateRepository responded ${response}`);
        if (response == '200') {
          this.successMessage = formSuccessUpdatedInterface;
        } else {
          this.errorMessage = formErrorWasntSaved;
        }
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = formErrorWasntSaved;
      },
      () => this.loadingMessage = ''
    );
  }

  addCurrent (baseUrl: string, valset: string, compLvl: string) {
    this.errorMessage = '';
    this.successMessage = '';
    this.loadingMessage = formSubmitting;
    this.currentInterface = new RepositoryInterface();
    this.currentInterface.baseUrl = baseUrl;
    this.currentInterface.accessSet = valset;
    this.currentInterface.desiredCompatibilityLevel = compLvl;
    this.currentInterface.typology = this.currentRepository.datasourceClass;
    this.repoService.addInterface(this.currentRepository.datasourceType, this.currentRepository.id, this.currentInterface).subscribe(
      addedInterface => {
        console.log(`addInterface responded ${addedInterface}`);
        this.currentInterface = addedInterface;
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = formErrorWasntSaved;
      },
      () => {
        this.loadingMessage = '';
        if (this.currentInterface.id) {
          this.successMessage = formSuccessAddedInterface;
        } else {
          this.errorMessage = formErrorWasntSaved;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.currentInterface && this.currentInterface.id && this.toBeDeleted) {
/*      this.repoService.deleteInterface(this.currentInterface.id).subscribe(
        response => console.log(`deleteInterface responded: ${response}`),
        error => console.log(error)
      );*/
      console.log(`deleting ${this.currentInterface.id}`);
    } else {
      console.log(`deleting empty interface form`);
    }
  }

}
