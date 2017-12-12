import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {CompatibilityComponent} from "./compatibility.component";
import {CompatibilityValidationComponent} from "./compatibility-validation.component";
import {CompatibilityMonitorComponent} from "./compatibility-monitor.component";
import {AuthGuardService} from '../../services/auth-guard.service';

const compatibilityRoutes: Routes = [
  {
    path: 'compatibility',
    component: CompatibilityComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/validation',
        pathMatch: 'full'
      },
      {
        path: 'validation',
        component: CompatibilityValidationComponent
      },
      {
        path: 'monitor',
        component: CompatibilityMonitorComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(compatibilityRoutes)],
  exports: [RouterModule]
})

export class CompatibilityRouting {}
