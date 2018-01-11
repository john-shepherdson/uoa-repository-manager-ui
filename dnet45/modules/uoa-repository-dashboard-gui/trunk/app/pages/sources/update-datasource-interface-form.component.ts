import { Component } from '@angular/core';
import { MyGroup } from '../../shared/reusablecomponents/forms/my-group.interface';
import { Validators } from '@angular/forms';

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
    compatibilityLevel: ['', Validators.required]
  };


  ngOnInit(){
    super.ngOnInit();
    console.log(this.group,this.parentGroup);

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

  saveInterface(){
    console.log("saved  something!");
    if (this.existingValSet){
      console.log(this.getMyControl('selectValidationSet').value);
    } else {
      console.log(this.getMyControl('customValidationSet').value);
    }
  }
}
