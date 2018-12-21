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
import { DatasourceInterfaceFormComponent } from './sources-forms/datasource-interface-form.component';
import { SrDataComponent } from './sources-register/sr-data.component';
import { RegisterDatasourceShareableComponent } from './sources-register/register-datasource-shareable.component';
import { DatasourceUpdateFormComponent } from './sources-forms/datasource-update-form.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';
import { DatasourceCreateFormComponent } from './sources-forms/datasource-create-form.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SourcesRouting,
    ReusableComponentsModule
  ],
  entryComponents : [
    DatasourceInterfaceFormComponent
  ],
  declarations: [
    SourcesComponent,
    SourcesRegisterComponent,
    SourcesUpdateComponent,
    SrLiteratureComponent,
    SrDataComponent,
    SrJournalComponent,
    SrAggregatorComponent,
    SourcesUpdateRepoComponent,
    RegisterDatasourceShareableComponent,
    DatasourceUpdateFormComponent,
    DatasourceCreateFormComponent,
    DatasourceInterfaceFormComponent,
    RepoFilter                           //a pipe that searches for string in repository name
  ]
})

export class SourcesModule {}
