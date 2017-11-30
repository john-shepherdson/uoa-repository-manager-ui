import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ContentEventsComponent} from "./content-events.component";
import {ContentComponent} from "./content.component";
import {ContentNotificationsComponent} from "./content-notifications.component";

const contentRoutes: Routes = [
  {
    path: 'content',
    component: ContentComponent,
    children: [
      {
        path: '',
        redirectTo: '/events',
        pathMatch: 'full'
      },
      {
        path: 'events',
        component: ContentEventsComponent
      },
      {
        path: 'notifications',
        component: ContentNotificationsComponent
      }
    ]
  }
]

@NgModule ({
  imports: [RouterModule.forChild(contentRoutes)],
  exports: [RouterModule]
})

export class ContentRouting {}
