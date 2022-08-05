import { NgModule } from '@angular/core';
import { SourcesRouting } from './sources.routing';
import { SourcesComponent } from './sources.component';
import { SourcesRegisterComponent } from './sources-register.component';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepoFilter } from './sourcesPipes';
import { RegisterDatasourceSelectExistingComponent } from './sources-register/register-datasource-select-existing.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';
import { RegisterNewDatasourceComponent } from './sources-register/register-new-datasource.component';
import { RegisterExistingDatasourceComponent } from './sources-register/register-existing-datasource.component';
import { DatasourceUpdateTermsFormComponent } from '../../shared/reusablecomponents/sources-forms/datasource-update-terms-form.component';
import {SrCrisComponent} from './sources-register/sr-cris.component';
import {SrRepositoryComponent} from './sources-register/sr-repository.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SourcesRouting,
    ReusableComponentsModule
  ],
  exports: [
    DatasourceUpdateTermsFormComponent
  ],
  declarations: [
    SourcesComponent,
    SourcesRegisterComponent,
    RegisterNewDatasourceComponent,
    RegisterExistingDatasourceComponent,
    SrRepositoryComponent,
    SrJournalComponent,
    SrAggregatorComponent,
    SrCrisComponent,
    RegisterDatasourceSelectExistingComponent,
    DatasourceUpdateTermsFormComponent,
    RepoFilter                           // a pipe that searches for string in repository name
  ]
})

export class SourcesModule {}
