import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SourcesRegisterComponent } from './sources-register.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';
import {SrCrisComponent} from './sources-register/sr-cris.component';
import {SrRepositoryComponent} from './sources-register/sr-repository.component';

const sourcesRoutes: Routes = [
  {
    path: '',
    // component: SourcesComponent,
    children: [
      {
        path: 'register',
        children: [
          {
            path: '',
            component: SourcesRegisterComponent
          },
          {
            path: 'repository',
            component: SrRepositoryComponent
          },
          {
            path: 'journal',
            component: SrJournalComponent
          },
          {
            path: 'aggregator',
            component: SrAggregatorComponent
          },
          {
            path: 'cris',
            component: SrCrisComponent
          }
        ]
      },
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(sourcesRoutes)],
  exports: [RouterModule]
})

export class SourcesRouting {}
