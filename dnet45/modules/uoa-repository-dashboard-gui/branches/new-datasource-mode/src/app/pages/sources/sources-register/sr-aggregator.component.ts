import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { AsideHelpContentComponent, HelpContentComponent } from '../../../shared/reusablecomponents/help-content.component';
import { DatasourceCreateFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-create-form.component';
import { RepositoryService } from '../../../services/repository.service';
import { noInterfacesSaved } from '../../../domain/shared-messages';
import { DatasourceNewInterfaceFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-new-interface-form.component';
import { concatMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { RegisterNewDatasourceComponent } from './register-new-datasource.component';

@Component ({
  selector: 'sr-aggregator',
  templateUrl: './register-new-datasource.component.html'
})
export class SrAggregatorComponent extends RegisterNewDatasourceComponent implements OnInit {

  ngOnInit() {
    this.datasourceType = 'aggregator';
    super.ngOnInit();
  }

}
