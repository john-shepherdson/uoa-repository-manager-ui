import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RepositoryComponent } from "./repository.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { authGuard } from "../../services/auth-guard.service";
import { SourcesUpdateRepoComponent } from "./update/sources-update-repo.component";

const repositoryRoutes: Routes = [
  {
    path: '',
    // redirectTo: '/403-forbidden',
    children: [
      {
        path: ':id',
        component: RepositoryComponent,
        data: {
          hasSidebar: true
        },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
            data: {
              hasSidebar: true
            }
          },
          {
            path: 'getImpact',
            loadChildren: () => import('./metrics/metrics.module').then(m => m.MetricsModule),
            canActivate: [authGuard]
          },
          {
            path: 'aggregationHistory',
            loadChildren: () => import('./aggregationhistory/compatibility-monitor.module').then(m => m.AggregationHistoryModule),
            canActivate: [authGuard]
          },
          {
            path: 'events',
            loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
            canActivate: [authGuard]
          },
          {
            path: 'update',
            component: SourcesUpdateRepoComponent,
            canActivate: [authGuard],
            data: {
              hasSidebar: true
            }
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
        redirectTo: '/403-forbidden',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(repositoryRoutes)],
  exports: [RouterModule]
})

export class RepositoryRoutingModule {}
