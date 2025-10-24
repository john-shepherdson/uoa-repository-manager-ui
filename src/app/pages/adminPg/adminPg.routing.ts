import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminPgComponent} from './adminPg.component';
import {AdminPgMetricsComponent} from './adminPg-metrics.component';
import {authGuard, canMatchGuard} from '../../services/auth-guard.service';
import {RegistrationComponent} from './adminPg-registrations.component';
import {OpenaireActionsComponent} from '../gateway-dashboard/requests/openaire-actions.component';
import {AdminRequestsComponent} from '../gateway-dashboard/requests/admin-requests.component';
import {BlockedRequestsComponent} from '../gateway-dashboard/requests/blocked-requests.component';

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
        component: OpenaireActionsComponent,
        // data: {
        //   requestParams: { sourceGatewayId: environment.OPENAIRE_ID }
        // }
      },
      {
        path: 'all-requests',
        component: AdminRequestsComponent
      },
      {
        path: 'blocked-requests',
        component: BlockedRequestsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminPgRouting {}
