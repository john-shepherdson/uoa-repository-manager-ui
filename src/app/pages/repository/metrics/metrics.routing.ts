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
        pathMatch: 'full'
      },
      {
        path: 'enable',
        component: MetricsEnableComponent,
        data: {
          hasSidebar: true
        }
      },
      {
        path: 'show_metrics',
        component: MetricsShowComponent,
        data: {
          hasSidebar: true
        }
      },
      {
        path: 'instructions',
        component: MetricsInstructionsComponent,
        data: {
          hasSidebar: true
        }
      },
      {
        path: 'usagestats',
        component: MetricsUsagestatsComponent,
        data: {
          hasSidebar: true
        }
      },
      {
        path: 'usagestats/:reportType/:reportID',
        component: MetricsUsagestatsReportComponent,
        data: {
          hasSidebar: true
        }
      },
      {
        path: 'usagestats-report-results',
        component: MetricsUsagestatsReportResultsComponent,
        data: {
          hasSidebar: true
        }
      }
    ]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(metricsRoutes)],
  exports: [RouterModule]
})

export class MetricsRouting {}

