/*
*  created by myrto
*/

import { NgModule } from '@angular/core';
import { SourcesRouting } from './sources.routing';
import { SourcesComponent } from './sources.component';
import { SourcesRegisterComponent } from './sources-register.component';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { SourcesUpdateComponent } from './sources-update.component';
import { SrLiteratureComponent } from './sources-register/sr-literature.component';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { SourcesUpdateRepoComponent } from './sources-update-repo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepoFilter } from './sourcesPipes';
import { DatasourceNewInterfaceFormComponent } from './sources-forms/datasource-new-interface-form.component';
import { SrDataComponent } from './sources-register/sr-data.component';
import { RegisterDatasourceSelectExistingComponent } from './sources-register/register-datasource-select-existing.component';
import { DatasourceUpdateFormComponent } from './sources-forms/datasource-update-form.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';
import { DatasourceCreateFormComponent } from './sources-forms/datasource-create-form.component';
import { RegisterNewDatasourceComponent } from './sources-register/register-new-datasource.component';
import { RegisterExistingDatasourceComponent } from './sources-register/register-existing-datasource.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SourcesRouting,
    ReusableComponentsModule
  ],
  declarations: [
    SourcesComponent,
    SourcesRegisterComponent,
    SourcesUpdateComponent,
    RegisterNewDatasourceComponent,
    RegisterExistingDatasourceComponent,
    SrLiteratureComponent,
    SrDataComponent,
    SrJournalComponent,
    SrAggregatorComponent,
    SourcesUpdateRepoComponent,
    RegisterDatasourceSelectExistingComponent,
    DatasourceUpdateFormComponent,
    DatasourceCreateFormComponent,
    DatasourceNewInterfaceFormComponent,
    RepoFilter                           // a pipe that searches for string in repository name
  ]
})

export class SourcesModule {}
