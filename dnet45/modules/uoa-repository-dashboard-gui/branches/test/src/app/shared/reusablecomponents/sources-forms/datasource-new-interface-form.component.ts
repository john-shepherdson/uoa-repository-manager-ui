import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseUrlDesc, compatibilityLevelDesc, customValSetDesc, Description, existingValSetDesc, commentDesc } from '../../../domain/oa-description';
import { InterfaceInformation, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { ValidatorService } from '../../../services/validator.service';
import { RepositoryService } from '../../../services/repository.service';
import { formErrorWasntSaved, formInfoLoading, formSubmitting, formSuccessAddedInterface, formSuccessUpdatedInterface, invalidCustomBaseUrl,
         nonRemovableInterface, noServiceMessage } from '../../../domain/shared-messages';

export class RepoFields {
  id: string;
  datasourceType: string;
  datasourceClass: string;
  registeredBy: string;
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
  inRegister: boolean;
  interfaceID: number;      // holds the interface index in the interfaces array as displayed
  currentRepo: RepoFields;  // a fraction of the Repository class
  currentInterface: RepositoryInterface;

  @Output() emitDeleteInterface: EventEmitter<number> = new EventEmitter<number>();
  interfaceToExport: RepositoryInterface;

  repoInterfaceForm: FormGroup;
  readonly repoInterfaceFormDef = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: [''],
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
  comments: string;
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
      this.chooseValSet(true);
      if (this.data[3]) {
        this.currentInterface = this.data[3];
        this.repoInterfaceForm.get('baseUrl').setValue(this.currentInterface.baseUrl);
        this.repoInterfaceForm.get('compatibilityLevel').setValue(this.currentInterface.desiredCompatibilityLevel);
      }
      this.getInterfaceInfo();
      this.getCompatibilityClasses();
    }
  }


  getInterfaceInfo() {
    this.successMessage = '';
    this.errorMessage = '';

    const  baseUrl = this.repoInterfaceForm.get('baseUrl').value;
    if (baseUrl) {
      this.loadingMessage = formInfoLoading;
      this.valService.getInterfaceInformation(baseUrl).subscribe(
        info => {
          this.interfaceInfo = info;
          if (this.interfaceInfo.identified) {
            this.identifiedBaseUrl = true;
            this.showIdentifiedBaseUrl = true;
          } else {
            this.errorMessage = invalidCustomBaseUrl;
            this.identifiedBaseUrl = true;  // pass interface without baseUrl identification
            this.showIdentifiedBaseUrl = false;
          }
          if (this.interfaceInfo.sets) {
            this.valsetList = this.interfaceInfo.sets;
            console.log(this.valsetList);
          }
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          // this.identifiedBaseUrl = false;
          this.errorMessage = noServiceMessage;
        },
        () => {
          if ( this.currentInterface && this.currentInterface.accessParams && this.currentInterface.accessParams['set'] ) {
            if ( this.valsetList.some( x => x === this.currentInterface.accessParams['set']) ) {
              this.repoInterfaceForm.get('selectValidationSet').setValue(this.currentInterface.accessParams['set']);
            } else {
              this.repoInterfaceForm.get('customValidationSet').setValue(this.currentInterface.accessParams['set']);
            }
          }
          this.loadingMessage = '';
          this.repoInterfaceForm.updateValueAndValidity();
          this.checkIfValid();
        }
      );
    }
  }

  getCompatibilityClasses() {
    this.repoService.getCompatibilityClasses(this.currentRepo.datasourceType).subscribe(
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
      if (this.currentInterface.desiredCompatibilityLevel &&
        this.classCodes.some( x => x === this.currentInterface.desiredCompatibilityLevel ) ) {
        this.existingCompLevel = this.compClasses[this.currentInterface.desiredCompatibilityLevel];
      } else {
        this.repoInterfaceForm.get('compatibilityLevel').setValue('');
        this.existingCompLevel = this.currentInterface.desiredCompatibilityLevel;
      }
    }
  }

  chooseValSet(fromList: boolean) {
    this.existingValSet = fromList;
    if (this.existingValSet) {
      this.repoInterfaceForm.get('selectValidationSet').enable();
      this.repoInterfaceForm.get('customValidationSet').disable();
    }  else {
      this.repoInterfaceForm.get('selectValidationSet').disable();
      this.repoInterfaceForm.get('customValidationSet').enable();
    }
    this.checkIfValid();
  }

  checkIfCompatibilityLevelWasChosen() {
    return ( (this.repoInterfaceForm.get('compatibilityLevel').value !== '') ||
             (this.existingCompLevel && (this.existingCompLevel !== '')) );
  }

  formIsValid() {
    return (this.repoInterfaceForm.valid &&
            this.identifiedBaseUrl &&
            this.checkIfCompatibilityLevelWasChosen());
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
      const baseUrl = this.repoInterfaceForm.get('baseUrl').value;
      let valset = '';
      if (this.existingValSet) {
        valset = this.repoInterfaceForm.get('selectValidationSet').value;
      } else {
        valset = this.repoInterfaceForm.get('customValidationSet').value;
      }
      let compLvl = '';
      if (this.repoInterfaceForm.get('compatibilityLevel').value) {
        this.existingCompLevel = this.compClasses[this.repoInterfaceForm.get('compatibilityLevel').value];
        console.log('this.existingCompLevel is', this.existingCompLevel);
        compLvl = this.repoInterfaceForm.get('compatibilityLevel').value;
      } else {
        compLvl = this.existingCompLevel;
      }
      let comment = '';
      if (this.repoInterfaceForm.get('comment').value) {
        comment = this.repoInterfaceForm.get('comment').value;
      }

      if (this.currentInterface) {
        this.updateCurrent(baseUrl, valset, compLvl, comment);
      } else {
        this.addCurrent(baseUrl, valset, compLvl, comment);
      }
    } else {
      this.interfaceToExport = null;
      this.errorMessage = 'Please make sure all required fields are filled with acceptable values.';
    }
  }

  getCurrentValues() {
    let intrf = this.currentInterface;
    if (intrf == null) {
      intrf = new RepositoryInterface();
    }
    intrf.baseUrl = this.repoInterfaceForm.get('baseUrl').value;
    if (this.existingValSet) {
      intrf.accessSet = this.repoInterfaceForm.get('selectValidationSet').value;
      intrf.accessParams = {'set': this.repoInterfaceForm.get('selectValidationSet').value};
    } else {
      intrf.accessSet = this.repoInterfaceForm.get('customValidationSet').value;
      intrf.accessParams = {'set': this.repoInterfaceForm.get('customValidationSet').value};
    }
    if (this.repoInterfaceForm.get('compatibilityLevel').value) {
      intrf.desiredCompatibilityLevel = this.repoInterfaceForm.get('compatibilityLevel').value;
      intrf.compliance = this.repoInterfaceForm.get('compatibilityLevel').value;
    } else {
      intrf.desiredCompatibilityLevel = this.existingCompLevel;
      intrf.compliance = this.existingCompLevel;
    }
    intrf.typology = this.currentRepo.datasourceClass;

    return intrf;
  }

  addCurrent (baseUrl: string, valset: string, compLvl: string, comment: string) {
    const currentInterface = new RepositoryInterface();
    currentInterface.baseUrl = baseUrl;
    currentInterface.accessSet = valset;
    currentInterface.accessParams = {'set': valset};
    currentInterface.desiredCompatibilityLevel = compLvl;
    currentInterface.compliance = compLvl;
    currentInterface.typology = this.currentRepo.datasourceClass;
    this.comments = comment;

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
    this.repoService.addInterface(this.currentRepo.datasourceType,
                                  this.currentRepo.id,
                                  this.currentRepo.registeredBy,
                                  this.comments,
                                  newInterface).subscribe(
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


  updateCurrent (baseUrl: string, valset: string, compLvl: string, comment: string) {
    this.currentInterface.baseUrl = baseUrl;
    this.currentInterface.accessSet = valset;
    this.currentInterface.accessParams['set'] = valset;
    this.currentInterface.desiredCompatibilityLevel = compLvl;
    this.currentInterface.compliance = compLvl;
    this.currentInterface.typology = this.currentRepo.datasourceClass;
    this.comments = comment;

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
    this.repoService.updateInterface(this.currentRepo.id,
                                     this.currentRepo.registeredBy,
                                     this.comments,
                                     this.currentInterface).subscribe(
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

  getComments() {
    return this.comments;
  }

}
