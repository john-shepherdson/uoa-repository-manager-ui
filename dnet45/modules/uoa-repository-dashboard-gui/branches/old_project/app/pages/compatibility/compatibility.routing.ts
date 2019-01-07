import { NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompatibilityComponent } from "./compatibility.component";
import { CompatibilityValidateTypeComponent } from './compatibility-validate-type.component';
import { CompatibilityValidationHistoryComponent } from './compatibility-validation-history.component';
import { CompatibilityValidationResultsComponent } from './compatibility-validation-results.component';
import { CompatibilityMonitorComponent } from './compatibility-monitor.component';
import { CompatibilityMonitorRepoComponent } from './compatibility-monitor-repo.component';
import { CompatibilityMonitorFullHistoryRepoComponent } from './compatibility-monitor-fullHistory-repo.component';
import { CompatibilityValidateComponent } from './compatibility-validate.component';
import { AuthGuardService } from '../../services/auth-guard.service';

const compatibilityRoutes: Routes = [
  {
    path: '',
    component: CompatibilityComponent,
    children: [
      {
        path: 'validate',
        component: CompatibilityValidateComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'validate/:type',
        component: CompatibilityValidateTypeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'browseHistory',
        component: CompatibilityValidationHistoryComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'browseHistory/:id',
        component: CompatibilityValidationResultsComponent
      },
      {
        path: 'monitor',
        component: CompatibilityMonitorComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'monitor/:id',
        component: CompatibilityMonitorRepoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'monitor/fullHistory/:id',
        component: CompatibilityMonitorFullHistoryRepoComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(compatibilityRoutes)],
  exports: [RouterModule]
})

export class CompatibilityRouting {}
