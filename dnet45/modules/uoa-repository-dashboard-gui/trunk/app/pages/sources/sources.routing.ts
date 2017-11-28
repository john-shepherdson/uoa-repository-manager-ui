import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SourcesComponent} from './sources.component';
import {SourcesRegisterComponent} from './sources-register.component';

const sourcesRoutes: Routes = [
  {
    path: 'sources',
    component: SourcesComponent,
    children: [
      {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full'
      },
      {
        path: 'register',
        component: SourcesRegisterComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forRoot(sourcesRoutes)],
  exports: [RouterModule]
})

export class SourcesRouting {}
