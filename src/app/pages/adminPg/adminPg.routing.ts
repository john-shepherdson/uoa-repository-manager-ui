import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';
import { authGuard, canMatchGuard } from '../../services/auth-guard.service';
import { RegistrationComponent } from './adminPg-registrations.component';
import { GatewayRequestsComponent } from './gateway-requests/gateway-requests.component';

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
        path: 'gateway-requests',
        component: GatewayRequestsComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminPgRouting {}
