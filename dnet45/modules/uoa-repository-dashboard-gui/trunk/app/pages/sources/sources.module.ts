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
import { SRLiteratureComponent } from './sources-register/sr-literature.component';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { SourcesUpdateRepoComponent } from './sources-update-repo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepoFilter } from './sourcesPipes';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';
import { SrDataComponent } from './sources-register/sr-data.component';
import { RegisterDatasourceShareableComponent } from './sources-register/register-datasource-shareable.component';

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
    UpdateDatasourceInterfaceFormComponent
  ],
  declarations: [
    SourcesComponent,
    SourcesRegisterComponent,
    SourcesUpdateComponent,
    SRLiteratureComponent,
    SrDataComponent,
    SourcesUpdateRepoComponent,
    UpdateDatasourceInterfaceFormComponent,
    RepoFilter,
    RegisterDatasourceShareableComponent
  ]
})

export class SourcesModule {}
