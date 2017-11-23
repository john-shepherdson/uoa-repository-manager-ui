/**
 * Created by stefania on 8/29/16.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";

const userRoutes: Routes = [
  {
    path: 'user/login',
    component: LoginComponent
  },
  {
    path: 'user/**',
    redirectTo: '/home'
  }
];


@NgModule ({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})

export class UserRouting {}
