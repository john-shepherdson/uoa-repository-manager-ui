import { NgModule } from '@angular/core';
import { SourcesRouting } from './sources.routing';
import { SourcesComponent } from './sources.component';
import { SourcesRegisterComponent } from './sources-register.component';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { SrLiteratureComponent } from './sources-register/sr-literature.component';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepoFilter } from './sourcesPipes';
import { SrDataComponent } from './sources-register/sr-data.component';
import { RegisterDatasourceSelectExistingComponent } from './sources-register/register-datasource-select-existing.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';
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
    RegisterNewDatasourceComponent,
    RegisterExistingDatasourceComponent,
    SrLiteratureComponent,
    SrDataComponent,
    SrJournalComponent,
    SrAggregatorComponent,
    RegisterDatasourceSelectExistingComponent,
    RepoFilter                           // a pipe that searches for string in repository name
  ]
})

export class SourcesModule {}
