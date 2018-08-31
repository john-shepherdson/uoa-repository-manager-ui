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

const compatibilityRoutes: Routes = [
  {
    path: '',
    component: CompatibilityComponent,
    children: [
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
      },
      {
        path: 'monitor/fullHistory/:id',
        component: CompatibilityMonitorFullHistoryRepoComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(compatibilityRoutes)],
  exports: [RouterModule]
})

export class CompatibilityRouting {}
