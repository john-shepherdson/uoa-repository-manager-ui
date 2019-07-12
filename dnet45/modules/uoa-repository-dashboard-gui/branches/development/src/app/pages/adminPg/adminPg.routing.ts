import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPgComponent } from './adminPg.component';
import { AdminPgMetricsComponent } from './adminPg-metrics.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import {RegistrationComponent} from './registration.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminPgComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService],
    children: [
      {
        path: 'metrics',
        component: AdminPgMetricsComponent
      },
      {
        path: 'registrations/:page/:pageSize',
        component: RegistrationComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminPgRouting {}
