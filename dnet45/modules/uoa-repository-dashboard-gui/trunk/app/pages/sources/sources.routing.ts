import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SourcesComponent} from './sources.component';
import {SourcesRegisterComponent} from './sources-register.component';
import {SourcesUpdateComponent} from "./sources-update.component";
import {AuthGuardService} from '../../services/auth-guard.service';
import {SourcesRegisterLiteratureComponent} from './sources-register/sources-register-literature.component';

const sourcesRoutes: Routes = [
  {
    path: 'sources',
    component: SourcesComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full'
      },
      {
        path: 'register',
        component: SourcesRegisterComponent,
      },
      {
        path: 'register/literature',
        component: SourcesRegisterLiteratureComponent
      },
      {
        path: 'update',
        component: SourcesUpdateComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(sourcesRoutes)],
  exports: [RouterModule]
})

export class SourcesRouting {}
