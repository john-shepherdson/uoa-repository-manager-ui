import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {CompatibilityComponent} from "./compatibility.component";
import {CompatibilityValidateComponent} from "./compatibility-validate.component";
import {CompatibilityMonitorComponent} from "./compatibility-monitor.component";
import {AuthGuardService} from '../../services/auth-guard.service';
import { CompatibilityValidationHistoryComponent } from './compatibility-validation-history.component';
import { CompatibilityMonitorRepoComponent } from './compatibility-monitor-repo.component';
import { CompatibilityValidateTypeComponent } from './compatibility-validate-type.component';
import { CompatibilityValidationResultsComponent } from './compatibility-validation-results.component';

const compatibilityRoutes: Routes = [
  {
    path: 'compatibility',
    component: CompatibilityComponent,
    //canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/validate',
        pathMatch: 'full'
      },
      {
        path: 'validate',
        component: CompatibilityValidateComponent
      },
      {
        path: 'validate/:type',
        component: CompatibilityValidateTypeComponent
      },
      {
        path: 'browseHistory',
        component: CompatibilityValidationHistoryComponent
      },
      {
        path: 'browseHistory/:id',
        component: CompatibilityValidationResultsComponent
      },
      {
        path: 'monitor',
        component: CompatibilityMonitorComponent
      },
      {
        path: 'monitor/:id',
        component: CompatibilityMonitorRepoComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(compatibilityRoutes)],
  exports: [RouterModule]
})

export class CompatibilityRouting {}
