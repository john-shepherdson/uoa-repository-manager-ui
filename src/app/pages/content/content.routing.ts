import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContentEventsComponent } from './content-events.component';
import { ContentComponent } from './content.component';
import { ContentNotificationsComponent } from './content-notifications.component';
import { ContentEventsOfRepositoryComponent } from './content-events-of-repository.component';
import { ContentEventsOfRepoEventslistComponent } from './content-events-of-repo-eventslist.component';
import { ContentNotificationsOfSubscriptionComponent } from './content-notifications-of-subscription.component';

const contentRoutes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: 'events',
        component: ContentEventsComponent,
      },
      {
        path: 'events/:name',
        component: ContentEventsOfRepositoryComponent,
      },
      {
        path: 'events/:name/:topic',
        component: ContentEventsOfRepoEventslistComponent,
      },
      {
        path: 'notifications',
        component: ContentNotificationsComponent,
      },
      {
        path: 'notifications/:id',
        component: ContentNotificationsOfSubscriptionComponent,
      }
    ]
  }
];

@NgModule ({
  imports: [RouterModule.forChild(contentRoutes)],
  exports: [RouterModule]
})

export class ContentRouting {}
