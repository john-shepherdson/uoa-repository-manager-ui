import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {ContentComponent} from "./content.component";
import {ContentRouting} from "./content.routing";
import {ContentEventsComponent} from "./content-events.component";
import {ContentNotificationsComponent} from "./content-notifications.component";
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { ContentEventsOfRepositoryComponent } from './content-events-of-repository.component';
import { ContentEventsOfRepoEventslistComponent } from './content-events-of-repo-eventslist.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ContentRouting,
//    FormsModule,
    ReactiveFormsModule,
    ReusableComponentsModule
  ],
  declarations: [
    ContentComponent,
    ContentEventsComponent,
    ContentEventsOfRepositoryComponent,
    ContentEventsOfRepoEventslistComponent,
    ContentNotificationsComponent,
  ]
})

export class ContentModule {}
