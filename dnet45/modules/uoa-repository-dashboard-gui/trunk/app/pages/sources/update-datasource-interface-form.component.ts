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

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: ['']
  };


  ngOnInit(){
    super.ngOnInit();
    console.log(this.group,this.parentGroup);
    this.getMyControl('customValidationSet').disable();
  }


  chooseValSet(existingValSet: boolean) {
     if(existingValSet) {
       this.getMyControl('selectValidationSet').enable();
       this.getMyControl('customValidationSet').disable();
     }  else {
       this.getMyControl('selectValidationSet').disable();
       this.getMyControl('customValidationSet').enable();
     }
  }

  saveInterface(){
    console.log("saved  something!");
  }

  removeInterface(){
    console.log("removed  something!");
  }
}
