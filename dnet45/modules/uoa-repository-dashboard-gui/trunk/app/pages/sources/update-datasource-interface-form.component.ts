import { Component, Injector } from '@angular/core';
import { MyGroup } from '../../domain/my-group.interface';
import { baseUrlDesc, Description } from '../../domain/oa-description';

@Component ({
  selector: 'update-datasource-interface-form',
  templateUrl: 'update-datasource-interface-form.component.html'
})

export class UpdateDatasourceInterfaceFormComponent extends MyGroup {
  successMessage: string;
  errorMessage: string;

  baseUrlDesc: Description = baseUrlDesc;

  constructor(private injector: Injector) {
    super(injector);
  }

}
