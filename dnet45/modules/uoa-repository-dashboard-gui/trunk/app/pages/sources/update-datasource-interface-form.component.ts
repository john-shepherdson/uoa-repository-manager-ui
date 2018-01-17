import { Component } from '@angular/core';
import { MyGroup } from '../../shared/reusablecomponents/forms/my-group.interface';
import { Validators } from '@angular/forms';
import { formErrorRequiredFields, formSuccessAddedInterface } from '../../domain/shared-messages';

@Component ({
  selector: 'update-datasource-interface-form',
  templateUrl: 'update-datasource-interface-form.component.html'
})

export class UpdateDatasourceInterfaceFormComponent extends MyGroup {

  successMessage: string;
  errorMessage: string;
  existingValSet: boolean;

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required],
  };


  ngOnInit(){

    super.ngOnInit();
    console.log(this.group,this.parentGroup);

    if (this.data.length) {
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
      this.successMessage = formSuccessAddedInterface;
      this.errorMessage = '';
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

}
