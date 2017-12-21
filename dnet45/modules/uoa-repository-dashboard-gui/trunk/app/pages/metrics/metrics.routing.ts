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

const metricsRoutes: Routes = [
  {
    path: 'getImpact',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: MetricsComponent,
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
      }
    ]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(metricsRoutes)],
  exports: [RouterModule]
})

export class MetricsRouting {}

