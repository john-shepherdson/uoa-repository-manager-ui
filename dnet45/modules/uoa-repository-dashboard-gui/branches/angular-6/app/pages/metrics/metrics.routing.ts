/**
 * Created by myrto on 11/27/17.
 */
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MetricsComponent } from './metrics.component';
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MetricsShowComponent } from './metrics-show.component';
import {MetricsUsagestatsComponent} from "./metrics-usagestats.component";
import { MetricsUsagestatsReportResultsComponent } from './metrics-usagestats-report-results.component';
import {MetricsUsagestatsReportComponent} from "./metrics-usagestats-report.component";

const metricsRoutes: Routes = [
    {
      path: '',
      component: MetricsComponent
    },
    {
      path: 'enable/:id',
      component: MetricsEnableComponent
    },
    {
      path: 'show_metrics/:id',
      component: MetricsShowComponent
    },
    {
      path: 'instructions/:id',
      component: MetricsInstructionsComponent
    },
    {
      path: 'usagestats/:id',
      component: MetricsUsagestatsComponent
    },
    {
      path: 'usagestats/:id/:reportID',
      component: MetricsUsagestatsReportComponent
    },
    {
      path: 'usagestats-report-results',
      component: MetricsUsagestatsReportResultsComponent
    }
];


@NgModule ({
  imports: [RouterModule.forChild(metricsRoutes)],
  exports: [RouterModule]
})

export class MetricsRouting {}

