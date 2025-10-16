import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPgRouting } from './adminPg.routing';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';
import { RegistrationComponent } from './adminPg-registrations.component';
import { AdminSideMenuComponent } from './admin-sidebar/admin-sidebar.component';
import { InputComponent } from '../../shared/input.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AdminRequestsComponent } from './gateway-requests/admin-requests.component';
import { ReusableTableComponent } from "src/app/shared/reusable-table/reusable-table.component";

@NgModule ({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminPgRouting,
    ReusableComponentsModule,
    InputComponent,
    MatPaginatorModule,
    ReusableTableComponent
],
  declarations: [
    AdminPgComponent,
    AdminSideMenuComponent,
    AdminPgMetricsComponent,
    RegistrationComponent,
    AdminRequestsComponent
  ]
})

export class AdminPgModule {}
