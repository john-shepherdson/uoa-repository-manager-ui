
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/pages/home',
    pathMatch: 'full'
  }
];

//export const appRoutingProviders: any[] = [];

//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule ({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRouting {}

