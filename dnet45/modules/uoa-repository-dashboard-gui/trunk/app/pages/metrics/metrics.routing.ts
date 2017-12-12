/**
 * Created by myrto on 11/27/17.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MetricsComponent} from './metrics.component';
import {MetricsEnableComponent} from './metrics-enable.component';
import {MetricsInstructionsComponent} from './metrics-instructions.component';
import {AuthGuardService} from '../../services/auth-guard.service';

const metricsRoutes: Routes = [
  {
    path: 'metrics',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: MetricsComponent,
      },
      {
        path: 'enable',
        component: MetricsEnableComponent
      },
      {
        path: 'instructions',
        component: MetricsInstructionsComponent
      }
    ]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(metricsRoutes)],
  exports: [RouterModule]
})

export class MetricsRouting {}

