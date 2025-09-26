import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepositoryComponent } from './repository.component';
import { RepositoryRoutingModule } from './repository-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedService } from '../../services/shared.service';
import { SourcesUpdateRepoComponent } from './update/sources-update-repo.component';
import { SourcesModule } from '../sources/sources.module';
import { UpdateRepoAdminsComponent } from './update/update-repo-admins.component';
import { RepositorySideMenuComponent } from './repository-sidebar/repository-sidebar.component';
import { InputComponent } from '../../shared/input.component';
import { GatewaysComponent } from './gateways/gateways.component';

@NgModule ({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RepositoryRoutingModule,
    ReusableComponentsModule,
    SourcesModule,
    InputComponent
  ],
  declarations: [
    RepositorySideMenuComponent,
    RepositoryComponent,
    DashboardComponent,
    GatewaysComponent,
    SourcesUpdateRepoComponent,
    UpdateRepoAdminsComponent
  ],
  providers: [
    SharedService
  ],
})

export class RepositoryModule {}
