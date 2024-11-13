import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseUrlDesc, compatibilityLevelDesc, customValSetDesc, Description, existingValSetDesc, commentDesc } from '../../../domain/oa-description';
import {ApiParamDetails, InterfaceInformation, RepositoryInterface, ValidationSet} from '../../../domain/typeScriptClasses';
import { ValidatorService } from '../../../services/validator.service';
import { RepositoryService } from '../../../services/repository.service';
import { formErrorWasntSaved, formInfoLoading, formSubmitting, formSuccessAddedInterface, formSuccessUpdatedInterface, invalidCustomBaseUrl,
         nonRemovableInterface, noServiceMessage } from '../../../domain/shared-messages';

export class RepoFields {
  id: string;
  datasourceType: string;
  datasourceClass: string;
  registeredBy: string;
  comments: string;
}

@Component({
  selector: 'app-repository-interface-form',
  templateUrl: './datasource-new-interface-form.component.html'
})
export class DatasourceNewInterfaceFormComponent implements OnInit {
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
  invalidCustomBaseUrl = invalidCustomBaseUrl;

  @Input() data: any[] = []; // expects an array containing at least 3 of the 4 below fields in this order
  @Input() mode: string = null;
  inRegister: boolean;
  interfaceID: number;      // holds the interface index in the interfaces array as displayed
  currentRepo: RepoFields;  // a fraction of the Repository class
  currentInterface: RepositoryInterface;

  @Output() emitDeleteInterface: EventEmitter<number> = new EventEmitter<number>();
  interfaceToExport: RepositoryInterface;

  repoInterfaceForm: FormGroup;
  readonly repoInterfaceFormDef = {
    baseurl: ['', Validators.required],
    selectValidationSet: [''],
    compatibilityLevel: null,
    desiredCompatibilityLevel: null,
    compatibilityLevelOverride: null,
    comment: ['']
  };
  baseUrlDesc: Description = baseUrlDesc;
  existingValSetDesc: Description = existingValSetDesc;
  customValSetDesc: Description = customValSetDesc;
  compatibilityLevelDesc: Description = compatibilityLevelDesc;
  commentDesc: Description = commentDesc;

  identifiedBaseUrl: boolean;
  canEdit = true;
  showIdentifiedBaseUrl: boolean = null;
  validationSets: ValidationSet[] = [];
  existingCompLevel: string;
  classCodes: string[] = [];
  compClasses: Map<string, string> = new Map<string, string>();
  interfaceInfo: InterfaceInformation;

  constructor(private fb: FormBuilder,
              private valService: ValidatorService,
              private repoService: RepositoryService) {}

  ngOnInit() {
    if (this.data && (this.data.length >= 3)) {
      this.inRegister = this.data[0];
      this.interfaceID = this.data[1];
      this.currentRepo = this.data[2];
      this.repoInterfaceForm = this.fb.group(this.repoInterfaceFormDef);
      // this.chooseValSet(true);
      if (this.data[3]) {
        this.currentInterface = this.data[3];
        if (this.currentInterface.baseurl !== null && this.currentInterface.baseurl !== '') {
          this.canEdit = false;
          this.repoInterfaceForm.get('baseurl').setValue(this.currentInterface.baseurl);
        }
        this.repoInterfaceForm.get('compatibilityLevel').setValue(this.currentInterface.compatibility);
        this.repoInterfaceForm.get('compatibilityLevelOverride').setValue(this.currentInterface.compatibilityOverride);
        this.repoService.getInterfaceDesiredCompatibilityLevel(this.currentInterface.datasource, this.currentInterface.id).subscribe(
          res => {
            if (res !== null) {
              this.repoInterfaceForm.get('desiredCompatibilityLevel').setValue(res['desiredCompatibilityLevel']);
            }
          }
        );
      }
      this.getInterfaceInfo();
      this.getCompatibilityClasses();
    }
  }


  getInterfaceInfo() {
    this.successMessage = '';
    this.errorMessage = '';

    const  baseurl = this.repoInterfaceForm.get('baseurl').value;
    if (baseurl) {
      this.loadingMessage = formInfoLoading;
      this.valService.getInterfaceInformation(baseurl).subscribe(
        info => {
          this.interfaceInfo = info;
          if (this.interfaceInfo.identified) {
            this.identifiedBaseUrl = true;
            this.showIdentifiedBaseUrl = true;
          } else {
            this.errorMessage = invalidCustomBaseUrl;
            this.identifiedBaseUrl = true;  // pass interface without baseurl identification
            this.showIdentifiedBaseUrl = false;
          }
          if (this.interfaceInfo.sets) {
            this.validationSets = this.interfaceInfo.sets;
            // console.log(this.validationSets);
          }
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          // this.identifiedBaseUrl = false;
          this.errorMessage = noServiceMessage;
        },
        () => {
          if (this.currentInterface?.apiParams?.find(entry => entry.param === 'set')) {
            this.repoInterfaceForm.get('selectValidationSet').setValue(this.currentInterface.apiParams
              .find(entry => entry.param === 'set').value);
            this.repoInterfaceForm.updateValueAndValidity();
            this.checkIfValid();
          }
          this.loadingMessage = '';
        }
      );
    }
  }

  getCompatibilityClasses() {
    // FIXME: Use eoscDatasourceType when we support the new model
    if (this.mode === null) {
      this.mode = this.currentRepo.datasourceType;
    }
    this.repoService.getCompatibilityClasses(this.mode).subscribe(
      classes => {
        this.compClasses = classes;
        this.classCodes = Object.keys(this.compClasses);
      },
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        this.getExistingCompatibilityLevel();
        this.repoInterfaceForm.updateValueAndValidity();
      }
    );
  }

  getExistingCompatibilityLevel() {
    if (this.currentInterface) {
      if (this.currentInterface.compatibility
        && this.classCodes.some( x => x === this.currentInterface.compatibilityOverride)) {
        this.existingCompLevel = this.compClasses[this.currentInterface.compatibility];
      } else {
        // this.repoInterfaceForm.get('compatibilityLevel').setValue('');
        this.existingCompLevel = this.currentInterface.compatibility;
      }
    }
  }

  checkIfCompatibilityLevelWasChosen() {
    return ( (this.repoInterfaceForm.get('compatibilityLevel').value !== '') ||
             (this.existingCompLevel && (this.existingCompLevel !== '')) );
  }

  formIsValid() {
    return (this.repoInterfaceForm.valid && this.identifiedBaseUrl && this.checkIfCompatibilityLevelWasChosen());
  }

  checkIfValid() {
    if (this.formIsValid()) {
      if (this.inRegister) {
        // this.successMessage = 'The interface will be stored when the registration procedure is completed.';
        this.successMessage = 'The harvesting settings are valid!';
        this.saveInterface();
      }
    } else {
      this.successMessage = '';
      // this.interfaceToExport = null;
    }

  }

  saveInterface() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.formIsValid()) {
      const baseurl = this.repoInterfaceForm.get('baseurl').value;
      const valset = this.repoInterfaceForm.get('selectValidationSet').value;
      const desiredCompLvl = this.repoInterfaceForm.get('desiredCompatibilityLevel').value;
      const compLvl = this.existingCompLevel;
      let comment = '';
      if (this.repoInterfaceForm.get('comment').value) {
        comment = this.repoInterfaceForm.get('comment').value;
      }

      if (this.currentInterface) {
        this.updateCurrent(baseurl, valset, desiredCompLvl, compLvl, comment);
      } else {
        this.addCurrent(baseurl, valset, desiredCompLvl, compLvl, comment);
      }
    } else {
      // this.interfaceToExport = null;
      this.errorMessage = 'Please make sure all required fields are filled with acceptable values.';
    }
  }

  getCurrentValues() {
    console.log('getcurrentvalues');
    let intrf = this.currentInterface;
    if (intrf == null) {
      intrf = new RepositoryInterface();
    }
    intrf.baseurl = this.repoInterfaceForm.get('baseurl').value;
    this.updateValidationSet(intrf, this.repoInterfaceForm.get('selectValidationSet').value);
    console.log(intrf);
    if (this.repoInterfaceForm.get('compatibilityLevel').value) {
      intrf.compatibilityOverride = this.repoInterfaceForm.get('compatibilityLevel').value;
      intrf.compatibility = this.repoInterfaceForm.get('compatibilityLevel').value;
    } else {
      intrf.compatibilityOverride = this.existingCompLevel;
      intrf.compatibility = this.existingCompLevel;
    }
    intrf.typology = this.currentRepo.datasourceClass;

    return intrf;
  }

  updateValidationSet(intrf: RepositoryInterface, value: string) {
    let validationSet = intrf.apiParams.find(element => element.param === 'set');
    if (!validationSet) {
      validationSet = new ApiParamDetails('set', value);
      intrf.apiParams.push(validationSet);
    } else {
      validationSet.value = this.repoInterfaceForm.get('selectValidationSet').value;
    }
  }

  addCurrent (baseurl: string, valset: string, desiredCompLvl: string, compLvl: string, comment: string) {
    console.log('add current');
    this.currentInterface = new RepositoryInterface();
    this.updateValidationSet(this.currentInterface, valset);
    this.currentInterface.baseurl = baseurl;
    this.currentInterface.desiredCompatibilityLevel = desiredCompLvl;
    this.currentInterface.compatibility = compLvl;
    this.currentInterface.typology = this.currentRepo.datasourceClass;
    this.currentInterface.comments = comment;

    if (!this.inRegister) {
      this.addInterface();
    } else {
      this.successMessage = 'The harvesting settings are valid!';
      console.log('SAVED !');
      this.interfaceToExport = this.currentInterface;
    }
  }

  addInterface() {
    this.loadingMessage = formSubmitting;
    this.repoService.addInterface(this.currentRepo.datasourceType, this.currentRepo.id,
                                  this.currentRepo.registeredBy, this.currentRepo.comments, this.currentInterface,
                                  this.repoInterfaceForm.get('desiredCompatibilityLevel').value).subscribe(
      addedInterface => {
        console.log(`addInterface responded ${JSON.stringify(addedInterface)}`);
        this.currentInterface = addedInterface;
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = formErrorWasntSaved;
        this.currentInterface = null;
      },
      () => {
        this.loadingMessage = '';
        if (this.currentInterface.id) {
          this.successMessage = formSuccessAddedInterface;
          this.getExistingCompatibilityLevel();
        } else {
          this.errorMessage = formErrorWasntSaved;
        }
      }
    );

  }

  updateCurrent (baseurl: string, valset: string, desiredCompLvl: string, compLvl: string, comment: string) {
    console.log('update current');
    this.updateValidationSet(this.currentInterface, valset);
    this.currentInterface.baseurl = baseurl;
    this.currentInterface.desiredCompatibilityLevel = desiredCompLvl;
    console.log(this.currentInterface.desiredCompatibilityLevel);
    this.currentInterface.compatibility = compLvl;
    this.currentInterface.typology = this.currentRepo.datasourceClass;
    this.currentInterface.comments = comment;

    if (!this.inRegister) {
      this.updateInterface();
    } else {
      this.successMessage = 'The harvesting settings are valid!';
      console.log('SAVED !');
      this.interfaceToExport = this.currentInterface;
    }
  }

  updateInterface() {
    this.loadingMessage = formSubmitting;
    this.repoService.updateInterface(this.currentRepo.id, this.currentRepo.registeredBy, this.currentRepo.comments,
                                     this.currentInterface, this.repoInterfaceForm.get('desiredCompatibilityLevel').value).subscribe(
      response => {
        console.log(`updateRepository responded ${JSON.stringify(response)}`);
        if (response) {
          this.currentInterface = response;
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
      () => {
        this.loadingMessage = '';
        this.getExistingCompatibilityLevel();
      }
    );
  }

  removeInterface() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.interfaceID > 0) {
      if (this.currentInterface && (this.currentInterface.id !== null) && !this.inRegister) {
        this.repoService.deleteInterface(this.currentInterface.id, this.currentRepo.registeredBy).subscribe(
          res => console.log(`deleteInterface responded: ${JSON.stringify(res)}`),
          er => console.log(er),
          () => this.emitDeleteInterface.emit(this.interfaceID)
        );
      } else {
        this.emitDeleteInterface.emit(this.interfaceID);
      }
    } else {
      this.errorMessage = nonRemovableInterface;
    }
  }

  getInterface() {
    return this.interfaceToExport;
  }

}
