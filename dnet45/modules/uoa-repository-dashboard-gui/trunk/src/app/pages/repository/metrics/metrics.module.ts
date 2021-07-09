/**
 * Created by myrto on 11/27/17.
 */
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { MetricsRouting } from './metrics.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { MetricsShowComponent } from './metrics-show.component';
import { MetricsUsagestatsComponent } from './metrics-usagestats.component';
import { MetricsUsagestatsReportComponent } from './metrics-usagestats-report.component';
import { MetricsUsagestatsReportResultsComponent } from './metrics-usagestats-report-results.component';
import { ReusableComponentsModule } from "../../../shared/reusablecomponents/reusable-components.module";

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    MetricsRouting,
    ReusableComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MetricsEnableComponent,
    MetricsInstructionsComponent,
    MetricsShowComponent,
    MetricsUsagestatsComponent,
    MetricsUsagestatsReportComponent,
    MetricsUsagestatsReportResultsComponent
  ]
})

export class MetricsModule { }
