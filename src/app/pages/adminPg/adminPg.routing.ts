import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';
import { authGuard, canMatchGuard } from '../../services/auth-guard.service';
import { RegistrationComponent } from './adminPg-registrations.component';
import { AdminRequestsComponent } from './gateway-requests/admin-requests.component';
import { GatewayActionsComponent } from './gateway-requests/gateway-actions.component';
const adminRoutes: Routes = [
  {
    path: '',
    component: AdminPgComponent,
    canActivate: [authGuard],
    canMatch: [canMatchGuard],
    children: [
      {
        path: 'metrics',
        component: AdminPgMetricsComponent
      },
      {
        path: 'registrations',
        component: RegistrationComponent
      },
      {
        path: 'openaire-requests',
        component: GatewayActionsComponent,
        // data: {
        //   requestParams: { sourceGatewayId: 'openaire-infrastructure' }
        // }
      },
      {
        path: 'all-requests',
        component: AdminRequestsComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminPgRouting {}
