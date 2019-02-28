import { Component, OnInit } from '@angular/core';
import { RegisterNewDatasourceComponent } from './register-new-datasource.component';

@Component ({
  selector: 'app-sr-journal',
  templateUrl: './register-new-datasource.component.html'
})

export class SrJournalComponent extends RegisterNewDatasourceComponent implements OnInit {

  ngOnInit() {
    this.datasourceType = 'journal';
    super.ngOnInit();
  }

}
