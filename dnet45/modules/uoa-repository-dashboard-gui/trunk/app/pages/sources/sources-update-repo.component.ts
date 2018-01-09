import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';

@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {
  interfaceForm: boolean;
  group: FormGroup;
  updateDatasource : Type<any> = UpdateDatasourceInterfaceFormComponent;

  constructor(private fb: FormBuilder) {
    this.group = fb.group({});
  }

  // @ViewChild('datasourceForm')
  // datasourceForm : UpdateDatasourceInterfaceFormComponent;

  ngOnInit() {
    this.interfaceForm = false;
    // console.log("DATASOURCE",this.datasourceForm);
  }

  showInterfaceFormToggle(){
    if(this.interfaceForm) {
      this.interfaceForm = false;
    } else {
      this.interfaceForm = true;
    }
  }
}
