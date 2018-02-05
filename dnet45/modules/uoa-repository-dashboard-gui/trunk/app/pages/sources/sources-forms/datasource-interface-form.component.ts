import { Component, Injector } from '@angular/core';
import { MyGroup } from '../../../shared/reusablecomponents/forms/my-group.interface';
import { Validators } from '@angular/forms';
import {
  formErrorRequiredFields, formSuccessAddedInterface,
  invalidCustomBaseUrl, noServiceMessage
} from '../../../domain/shared-messages';
import { ValidatorService } from '../../../services/validator.service';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { InterfaceInformation } from '../../../domain/typeScriptClasses';

@Component ({
  selector: 'datasource-interface-form',
  templateUrl: './datasource-interface-form.component.html'
})

export class DatasourceInterfaceFormComponent extends MyGroup {

  successMessage: string;
  errorMessage: string;

  mode: string;

  identifiedBaseUrl: boolean;
  existingValSet: boolean;
  interfaceInfo: InterfaceInformation;

  compClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required],
  };

  constructor(injector: Injector,
              private valService: ValidatorService,
              private repoService: RepositoryService,
              private route: ActivatedRoute){
    super(injector);
  }

  ngOnInit() {

    setTimeout(() => {
      super.ngOnInit();
      this.getMode();

      console.log(this.group, this.parentGroup);
      if (this.data && this.data.length) {
/*          this.group.patchValue({
            baseUrl : this.data[0].baseUrl,
            selectValidationSet : this.data[0].accessSet,
            compatibilityLevel : this.data[0].desiredCompatibilityLevel
          });*/
        this.patchData.next({
          baseUrl: this.data[0].baseUrl,
/*          selectValidationSet: this.data[0].accessSet,  [ IS THIS THE CORRECT FIELD ?????]*/
          compatibilityLevel: this.data[0].desiredCompatibilityLevel
        });
        this.getInterfaceInfo(this.data[0].baseUrl);
        this.getCompatibilityClasses();
        this.data.splice(0, 1);
      }

      this.existingValSet = true;
      this.getMyControl('customValidationSet').disable();
    }, 1500);
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

  saveInterface() {
    if (this.group.valid) {
      if (this.identifiedBaseUrl) {
        let baseUrl = this.getMyControl('baseUrl').value;
        let valset: string;
        if (this.getMyControl('selectValidationSet').enabled ) {
          valset = this.getMyControl('selectValidationSet').value;
        } else {
          valset = this.getMyControl('customValidationSet').value;
        }
        let compLvl = this.getMyControl('compatibilityLevel').value;
        // save/update interface
        this.successMessage = formSuccessAddedInterface;
        this.errorMessage = '';
      } else {
        this.errorMessage = invalidCustomBaseUrl;
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

  getInterfaceInfo(baseUrl: string) {
    this.valService.getInterfaceInformation(baseUrl).subscribe(
      info => {
        this.interfaceInfo = info;
        if (this.interfaceInfo) {
          this.identifiedBaseUrl = true;
          this.errorMessage = '';
        } else {
          this.errorMessage = invalidCustomBaseUrl;
        }

      },
      error => {
        console.log(error);
        this.identifiedBaseUrl = false;
        this.errorMessage = noServiceMessage;
      }
    );
  }

  getMode() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.mode = this.route.snapshot.paramMap.get('id').split("_")[0];
    } else {
      this.mode = this.route.snapshot.url[0].path;
    }
  }

  getCompatibilityClasses() {
    this.repoService.getCompatibilityClasses(this.mode).subscribe(
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


}
