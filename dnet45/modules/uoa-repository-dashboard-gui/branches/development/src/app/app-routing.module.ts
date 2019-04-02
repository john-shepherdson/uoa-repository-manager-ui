import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuardService } from './services/auth-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForbiddenPageComponent } from './shared/reusablecomponents/403-forbidden-page.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sources',
    loadChildren: './pages/sources/sources.module#SourcesModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'compatibility',
    loadChildren: './pages/compatibility/compatibility.module#CompatibilityModule'
  },
  {
    path: 'content',
    loadChildren: './pages/content/content.module#ContentModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'getImpact',
    loadChildren: './pages/metrics/metrics.module#MetricsModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    loadChildren: './pages/adminPg/adminPg.module#AdminPgModule',
  },
  {
    path: '403-forbidden',
    component: ForbiddenPageComponent
  },
  {
    path: '**',
    redirectTo: '/landing'
  }
];


@NgModule ({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

