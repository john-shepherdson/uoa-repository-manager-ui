import { Component } from '@angular/core';
import { MyGroup } from '../../shared/reusablecomponents/forms/my-group.interface';

@Component ({
  selector: 'update-datasource-form',
  templateUrl: 'update-datasource-form.component.html'
})

export class UpdateDatasourceFormComponent extends MyGroup {

  readonly groupDefinition = {
  };



  ngOnInit() {
    super.ngOnInit();
  }
}
