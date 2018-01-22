import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { JournalInfoFormComponent } from '../sources-forms/journal-info-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { RepositoryService } from '../../../services/repository.service';

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

  datasourceId: string;

  @ViewChild ('registerJournal')
  registerJournal: JournalInfoFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  addDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;


  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService) {}

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

}
