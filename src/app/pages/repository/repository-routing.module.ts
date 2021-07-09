import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RepositoryComponent } from "./repository.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "../../services/auth-guard.service";
import { SourcesUpdateRepoComponent } from "./update/sources-update-repo.component";

const repositoryRoutes: Routes = [
  {
    path: '',
    // redirectTo: '/403-forbidden',
    children: [
      {
        path: ':id',
        component: RepositoryComponent,
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            // pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'getImpact',
            loadChildren: './metrics/metrics.module#MetricsModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'aggregationHistory',
            loadChildren: './aggregationhistory/compatibility-monitor.module#AggregationHistoryModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'events',
            loadChildren: './events/events.module#EventsModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'update',
            component: SourcesUpdateRepoComponent,
            canActivate: [AuthGuardService]
          },
          // {
          //   path: 'videos/:id',
          //   component: VideoLesson
          // },
          // {
          //   path: 'textlectures/:id',
          //   component: TextLesson
          // },
          // {
          //   path: 'quizzes/:id',
          //   component: QuizLesson
          // },
          // {
          //   path: 'interactivelessons/:id',
          //   component: InteractiveLesson
          // }
        ]
      },
      {
        path: '',
        redirectTo: '/403-forbidden'
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(repositoryRoutes)],
  exports: [RouterModule]
})

export class RepositoryRoutingModule {}
