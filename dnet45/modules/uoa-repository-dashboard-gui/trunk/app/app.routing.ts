
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "./pages/landing/landing.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuardService} from "./services/auth-guard.service";

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
  }
];

//export const appRoutingProviders: any[] = [];

//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule ({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRouting {}

