import { Component, Injector } from '@angular/core';
import { MyGroup } from '../../../shared/reusablecomponents/forms/my-group.interface';
import { Validators } from '@angular/forms';
import {
  formErrorRequiredFields, formSuccessAddedInterface,
  invalidCustomBaseUrl
} from '../../../domain/shared-messages';
import { ValidatorService } from '../../../services/validator.service';

@Component ({
  selector: 'datasource-interface-form',
  templateUrl: './datasource-interface-form.component.html'
})

export class DatasourceInterfaceFormComponent extends MyGroup {

  successMessage: string;
  errorMessage: string;
  existingValSet: boolean;

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required],
  };

  constructor(injector: Injector, private valService: ValidatorService){
    super(injector);
  }

  ngOnInit(){

    super.ngOnInit();
    console.log(this.group,this.parentGroup);

    if (this.data && this.data.length) {
/*
      this.group.patchValue({
        baseUrl : this.data[0].baseUrl,
        selectValidationSet : this.data[0].accessSet,
        compatibilityLevel : this.data[0].desiredCompatibilityLevel
      });
*/
      this.patchData.next({
        baseUrl : this.data[0].baseUrl,
        selectValidationSet : this.data[0].accessSet,
        compatibilityLevel : this.data[0].desiredCompatibilityLevel
      });
      this.data.splice(0,1);
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

  saveInterface() {
    if(this.group.valid) {
      let response: boolean;
      this.valService.identifyRepository(this.group.get('baseUrl').value).subscribe(
        res => response = res,
        error => console.log(error)
      );
      if ( response ) {
        this.successMessage = formSuccessAddedInterface;
        this.errorMessage = '';
      } else {
        this.errorMessage = invalidCustomBaseUrl;
        this.successMessage = '';
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

}
