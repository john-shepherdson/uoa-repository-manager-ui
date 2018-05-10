
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "./pages/landing/landing.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {MetricsModule} from "./pages/metrics/metrics.module";

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
    loadChildren: './pages/compatibility/compatibility.module#CompatibilityModule',
    canActivate: [AuthGuardService]
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
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: '/landing'
  }
];

//export const appRoutingProviders: any[] = [];

//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule ({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRouting {}

