import {RouterModule, Routes} from "@angular/router";
import {AdminPgComponent} from "./adminPg.component";
import {NgModule} from "@angular/core";
import {AdminPgHelpTextsComponent} from "./adminPg-help-texts.component";

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminPgComponent,
    children: [
      {
        path: '',
        redirectTo: '/help-texts',
        pathMatch: 'full'
      },
      {
        path: 'help-texts',
        component: AdminPgHelpTextsComponent
      }
    ]
  }
]

@NgModule ({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminPgRouting {}
