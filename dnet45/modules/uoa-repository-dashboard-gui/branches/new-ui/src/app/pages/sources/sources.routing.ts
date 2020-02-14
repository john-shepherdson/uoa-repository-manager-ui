import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SourcesRegisterComponent } from './sources-register.component';
import { SrLiteratureComponent } from './sources-register/sr-literature.component';
import { SrDataComponent } from './sources-register/sr-data.component';
import { SrJournalComponent } from './sources-register/sr-journal.component';
import { SrAggregatorComponent } from './sources-register/sr-aggregator.component';

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
    ]
    // path: '',
    // component: SourcesRegisterComponent,
    // children: [
    //   {
    //     path: 'literature',
    //     component: SrLiteratureComponent
    //   },
    //   {
    //     path: 'data',
    //     component: SrDataComponent
    //   },
    //   {
    //     path: 'journal',
    //     component: SrJournalComponent
    //   },
    //   {
    //     path: 'aggregator',
    //     component: SrAggregatorComponent
    //   }
    // ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(sourcesRoutes)],
  exports: [RouterModule]
})

export class SourcesRouting {}
