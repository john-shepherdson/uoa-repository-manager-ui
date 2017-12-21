import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ContentEventsComponent } from "./content-events.component";
import { ContentComponent } from "./content.component";
import { ContentNotificationsComponent } from "./content-notifications.component";
import { AuthGuardService } from '../../services/auth-guard.service';
import { ContentEventsOfRepositoryComponent } from './content-events-of-repository.component';

const contentRoutes: Routes = [
  {
    path: 'content',
    component: ContentComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/events',
        pathMatch: 'full'
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            component: ContentEventsComponent,
            pathMatch: 'full'
          },
          {
            path: ':name',
            component: ContentEventsOfRepositoryComponent,
          }
        ]
      },
      {
        path: 'notifications',
        component: ContentNotificationsComponent
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(contentRoutes)],
  exports: [RouterModule]
})

export class ContentRouting {}
