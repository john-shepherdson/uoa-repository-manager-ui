import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseUrlDesc, compatibilityLevelDesc, customValSetDesc, Description, existingValSetDesc, commentDesc } from '../../../domain/oa-description';
import {ApiParamDetails, InterfaceInformation, RepositoryInterface} from '../../../domain/typeScriptClasses';
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
  showIdentifiedBaseUrl: boolean;
  valsetList: string[] = [];
  existingCompLevel: string;
  classCodes: string[] = [];
  compClasses: Map<string, string> = new Map<string, string>();
  existingValSet: boolean;
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
        this.repoInterfaceForm.get('baseurl').setValue(this.currentInterface.baseurl);
        this.repoInterfaceForm.get('compatibilityLevel').setValue(this.currentInterface.compatibility);
        this.repoInterfaceForm.get('compatibilityLevelOverride').setValue(this.currentInterface.compatibilityOverride);
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
            this.valsetList = this.interfaceInfo.sets;
            // console.log(this.valsetList);
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
            this.repoService.getInterfaceDesiredCompatibilityLevel(this.currentInterface.datasource, this.currentInterface.id).subscribe(
              res => {
                console.log(res);
                this.repoInterfaceForm.get('desiredCompatibilityLevel').setValue(res['desiredCompatibilityLevel']);
              }
            );
          this.loadingMessage = '';
          this.repoInterfaceForm.updateValueAndValidity();
          this.checkIfValid();
          }
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
      this.interfaceToExport = null;
    }

  }

  saveInterface() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.formIsValid()) {
      const baseurl = this.repoInterfaceForm.get('baseurl').value;
      let valset = '';
      if (this.existingValSet) {
        valset = this.repoInterfaceForm.get('selectValidationSet').value;
      }
      let desiredCompLvl = '';
      if (this.repoInterfaceForm.get('compatibilityLevel').value) {
        // this.existingCompLevel = this.compClasses[this.repoInterfaceForm.get('compatibilityLevel').value];
        // console.log('this.existingCompLevel is', this.existingCompLevel);
        desiredCompLvl = this.repoInterfaceForm.get('compatibilityLevel').value;
      }
      const compLvl = this.existingCompLevel;
      let comment = '';
      if (this.repoInterfaceForm.get('comment').value) {
        comment = this.repoInterfaceForm.get('comment').value;
      }

      if (this.currentInterface) {
        this.updateCurrent(baseurl, valset, desiredCompLvl, compLvl, comment);
      } else {
        this.addCurrent(baseurl, valset, compLvl, comment);
      }
    } else {
      this.interfaceToExport = null;
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
    this.updateValidationSet(intrf, this.repoInterfaceForm.get(this.existingValSet ? 'selectValidationSet' : 'customValidationSet').value);
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

  addCurrent (baseurl: string, valset: string, compLvl: string, comment: string) {
    console.log('add current');
    const currentInterface = new RepositoryInterface();
    this.updateValidationSet(currentInterface, valset);
    currentInterface.baseurl = baseurl;
    currentInterface.compatibilityOverride = compLvl;
    currentInterface.compatibility = compLvl;
    currentInterface.typology = this.currentRepo.datasourceClass;
    currentInterface.comments = comment;

    if (!this.inRegister) {
      this.addInterface(currentInterface);
    } else {
      this.successMessage = 'The harvesting settings are valid!';
      console.log('SAVED !');
      this.interfaceToExport = currentInterface;
    }
  }

  addInterface(newInterface: RepositoryInterface) {
    this.loadingMessage = formSubmitting;
    this.repoService.addInterface(this.currentRepo.datasourceType, this.currentRepo.id,
                                  this.currentRepo.registeredBy, this.currentRepo.comments, newInterface).subscribe(
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
    this.currentInterface.compatibilityOverride = compLvl;
    this.currentInterface.compatibility = compLvl;
    this.currentInterface.typology = this.currentRepo.datasourceClass;
    this.currentInterface.comments = comment;

    if (!this.inRegister) {
      this.updateInterface(desiredCompLvl);
    } else {
      this.successMessage = 'The harvesting settings are valid!';
      console.log('SAVED !');
      this.interfaceToExport = this.currentInterface;
    }
  }

  updateInterface(desiredCompatibilityLevel: string) {
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
