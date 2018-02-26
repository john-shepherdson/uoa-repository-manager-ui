import { Component, Injector } from '@angular/core';
import { MyGroup } from '../../../shared/reusablecomponents/forms/my-group.interface';
import { FormBuilder, Validators } from '@angular/forms';
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
  valset: string[] = [];

  compClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required]
  };

  constructor(injector: Injector,
              private valService: ValidatorService,
              private repoService: RepositoryService,
              private route: ActivatedRoute){
    super(injector);
  }

  ngOnInit() {
    this.getCompatibilityClasses();

    setTimeout( () => {
      /*if (this.data && this.data.length) {
        this.parentGroup.patchValue({
            baseUrl: this.data[0].baseUrl,
            selectValidationSet: '',
            customValidationSet: '',
          compatibilityLevel:this.data[0].desiredCompatibilityLevel
          }
        );
        this.data.splice(0,1);
      }*/
      super.ngOnInit();
      console.log(this.group, this.parentGroup);

      if (this.getMyControl('baseUrl').value) {
        this.getInterfaceInfo(this.data[0].baseUrl);
      }
      this.existingValSet = true;
      this.getMyControl('customValidationSet').disable();
    },500);
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
    if(this.group && this.group.get('baseUrl').value) {
      this.valService.getInterfaceInformation(baseUrl).subscribe(
        info => this.interfaceInfo = info,
        error => {
          console.log(error);
          this.identifiedBaseUrl = false;
          this.errorMessage = noServiceMessage;
        },
        () => {
          if (this.interfaceInfo && this.interfaceInfo.identified) {
            this.identifiedBaseUrl = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = invalidCustomBaseUrl;
          }
          if (this.interfaceInfo.sets && this.interfaceInfo.sets.length) {
            this.valset = this.interfaceInfo.sets;
          }
        }
      );
    }
  }

  getMode() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.mode = this.route.snapshot.paramMap.get('id').split("_")[0];
    } else {
      this.mode = this.route.snapshot.url[0].path;
    }
  }

  getCompatibilityClasses() {
    this.getMode();
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
