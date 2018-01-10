import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';
import { Description, interfaceFormDesc } from '../../domain/oa-description';

@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasource : Type<any> = UpdateDatasourceInterfaceFormComponent;

  constructor(private fb: FormBuilder) {
    this.group = fb.group({});
  }

  // use for the other tab
  // @ViewChild('datasourceForm')
  // datasourceForm : UpdateDatasourceInterfaceFormComponent;

  ngOnInit() {
    // console.log("DATASOURCE",this.datasourceForm);
  }

}
