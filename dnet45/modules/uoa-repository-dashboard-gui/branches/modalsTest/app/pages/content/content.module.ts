import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {ContentComponent} from "./content.component";
import {ContentRouting} from "./content.routing";
import {ContentEventsComponent} from "./content-events.component";
import {ContentNotificationsComponent} from "./content-notifications.component";

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ContentRouting
  ],
  declarations: [
    ContentComponent,
    ContentEventsComponent,
    ContentNotificationsComponent
  ]
})

export class ContentModule {}
