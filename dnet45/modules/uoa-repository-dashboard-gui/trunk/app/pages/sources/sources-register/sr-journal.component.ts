import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { Repository } from '../../../domain/typeScriptClasses';
import { DatasourceCreateFormComponent } from '../sources-forms/datasource-create-form.component';

@Component ({
  selector: 'app-sr-journal',
  templateUrl: 'sr-journal.component.html'
})

export class SrJournalComponent implements OnInit {
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';

  @ViewChild ('registerJournal')
  registerJournal: DatasourceCreateFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  addDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;

  repo: Repository;

  constructor(
    private fb: FormBuilder) {}

  ngOnInit() {
    this.showForm = true;
  }

  moveAStep(){
    if (this.showForm) {
      if (this.registerJournal.registerDatasource()){
        this.showForm = false;
        this.showInterfaces = true;
        this.step2 = 'active';
        this.group = this.fb.group({});
      }
    } else if (this.showInterfaces) {
      this.showInterfaces = false;
      this.showFinish = true;
      this.step3 = 'active';
    }
  }

  moveBackAStep(){
    if (this.showInterfaces) {
      this.showForm = true;
      this.showInterfaces = false;
      this.step2 = '';
    } else if (this.showFinish) {
      this.showInterfaces = true;
      this.showFinish = false;
      this.step3 = '';
    }
  }

  getCurrentRepo(repo: Repository) {
    this.repo = repo;
  }

}
