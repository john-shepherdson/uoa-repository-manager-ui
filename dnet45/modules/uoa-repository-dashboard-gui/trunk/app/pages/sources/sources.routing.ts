/*
*  created by myrto
*/

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources.component';
import { SourcesRegisterComponent } from './sources-register.component';
import { SourcesUpdateComponent } from './sources-update.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SrLiteratureComponent } from './sources-register/sr-literature.component';
import { SourcesUpdateRepoComponent } from './sources-update-repo.component';
import { SrDataComponent } from './sources-register/sr-data.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';

const sourcesRoutes: Routes = [
  {
    path: '',
    component: SourcesComponent,
    children: [
      {
        path: 'register',
        children: [
          {
            path: '',
            component: SourcesRegisterComponent,
            pathMatch: 'full'
          },
          {
            path: 'literature',
            component: SrLiteratureComponent
          },
          {
            path: 'data',
            component: SrDataComponent
          },
          {
            path: 'journal',
            component: SrJournalComponent
          },
          {
            path: 'aggregator',
            component: SrAggregatorComponent
          }
        ]
      },
      {
        path: 'update',
        children: [
          {
            path: '',
            component: SourcesUpdateComponent
          },
          {
            path: ':id',
            component: SourcesUpdateRepoComponent
          }
        ]
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(sourcesRoutes)],
  exports: [RouterModule]
})

export class SourcesRouting {}
