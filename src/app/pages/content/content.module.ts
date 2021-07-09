import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { ContentEventsOfRepositoryComponent } from './content-events-of-repository.component';
import { ContentEventsOfRepoEventslistComponent } from './content-events-of-repo-eventslist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentNotificationsOfSubscriptionComponent } from './content-notifications-of-subscription.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { ContentRouting } from './content.routing';
import { ContentComponent } from './content.component';
import { ContentEventsComponent } from './content-events.component';
import { ContentNotificationsComponent } from './content-notifications.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ContentRouting,
    ReactiveFormsModule,
    ReusableComponentsModule
  ],
  declarations: [
    ContentComponent,
    ContentEventsComponent,
    ContentEventsOfRepositoryComponent,
    ContentEventsOfRepoEventslistComponent,
    ContentNotificationsComponent,
    ContentNotificationsOfSubscriptionComponent
  ]
})

export class ContentModule {}
