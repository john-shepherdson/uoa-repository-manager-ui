import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdminPgRouting } from './adminPg.routing';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    AdminPgRouting,
    ReusableComponentsModule
  ],
  declarations: [
    AdminPgComponent,
    AdminPgMetricsComponent
  ]
})

export class AdminPgModule {}
