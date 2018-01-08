import { Component, Injector, Input } from '@angular/core';
import { MyGroup } from '../../shared/reusablecomponents/forms/my-group.interface';
import { baseUrlDesc, validationSetDesc, Description } from '../../domain/oa-description';
import { FormGroup, Validators } from '@angular/forms';

@Component ({
  selector: 'update-datasource-interface-form',
  templateUrl: 'update-datasource-interface-form.component.html'
})

export class UpdateDatasourceInterfaceFormComponent extends MyGroup {
  successMessage: string;
  errorMessage: string;

  baseUrlDesc: Description = baseUrlDesc;
  validationSetDesc: Description = validationSetDesc;

  readonly groupDefinition = {
    baseUrl: this._fb.group({}),
    validationSet: ['', Validators.required],
    compatibilityLevel: ''
  }

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(){
    this.generate();
  }
}
