import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminPgRouting } from './adminPg.routing';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';
import {RegistrationComponent} from './adminPg-registrations.component';
import {AdminSideMenuComponent} from './admin-sidebar/admin-sidebar.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AdminPgRouting,
    ReusableComponentsModule,
  ],
  declarations: [
    AdminPgComponent,
    AdminSideMenuComponent,
    AdminPgMetricsComponent,
    RegistrationComponent
  ]
})

export class AdminPgModule {}
