/**
 * Created by myrto on 11/27/17.
 */
import { RouterModule, Routes } from '@angular/router';
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsShowComponent } from './metrics-show.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { MetricsUsagestatsComponent } from './metrics-usagestats.component';
import { MetricsUsagestatsReportComponent } from './metrics-usagestats-report.component';
import { MetricsUsagestatsReportResultsComponent } from './metrics-usagestats-report-results.component';
import { NgModule } from '@angular/core';

const metricsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'enable',
        // pathMatch: 'full'
      },
      {
        path: 'enable',
        component: MetricsEnableComponent
      },
      {
        path: 'show_metrics',
        component: MetricsShowComponent
      },
      {
        path: 'instructions',
        component: MetricsInstructionsComponent
      },
      {
        path: 'usagestats',
        component: MetricsUsagestatsComponent
      },
      {
        path: 'usagestats/:reportID',
        component: MetricsUsagestatsReportComponent
      },
      {
        path: 'usagestats-report-results',
        component: MetricsUsagestatsReportResultsComponent
      }
    ]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(metricsRoutes)],
  exports: [RouterModule]
})

export class MetricsRouting {}

