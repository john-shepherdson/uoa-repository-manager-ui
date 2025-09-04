import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompatibilityComponent } from './compatibility.component';
import { CompatibilityValidateTypeComponent } from './compatibility-validate-type.component';
import { CompatibilityValidationHistoryComponent } from './compatibility-validation-history.component';
import { CompatibilityValidationResultsComponent } from './compatibility-validation-results.component';
import { CompatibilityValidateComponent } from './compatibility-validate.component';
import { authGuard } from '../../services/auth-guard.service';
import { CompatibilityValidationCrisResultsComponent } from './compatibility-validation-cris-results.component';

const compatibilityRoutes: Routes = [
  {
    path: '',
    component: CompatibilityComponent,
    children: [
      {
        path: 'validate',
        component: CompatibilityValidateComponent,
        canActivate: [authGuard]
      },
      {
        path: 'validate/:type',
        component: CompatibilityValidateTypeComponent,
        canActivate: [authGuard]
      },
      {
        path: 'browseHistory',
        component: CompatibilityValidationHistoryComponent,
        canActivate: [authGuard]
      },
      {
        path: 'browseHistory/cris/:id',
        component: CompatibilityValidationCrisResultsComponent
      },
      {
        path: 'browseHistory/:id',
        component: CompatibilityValidationResultsComponent
      },
      // {
      //   path: 'monitor',
      //   component: CompatibilityMonitorComponent,
      //   canActivate: [authGuard]
      // },
      // {
      //   path: 'monitor/:id',
      //   component: CompatibilityMonitorRepoComponent,
      //   canActivate: [authGuard]
      // },
      // {
      //   path: 'monitor/fullHistory/:id',
      //   component: CompatibilityMonitorFullHistoryRepoComponent,
      //   canActivate: [authGuard]
      // }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(compatibilityRoutes)],
  exports: [RouterModule]
})

export class CompatibilityRouting {}
