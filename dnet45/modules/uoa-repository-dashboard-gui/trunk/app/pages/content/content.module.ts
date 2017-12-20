import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {ContentComponent} from "./content.component";
import {ContentRouting} from "./content.routing";
import {ContentEventsComponent} from "./content-events.component";
import {ContentNotificationsComponent} from "./content-notifications.component";
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ContentRouting,
    ReusableComponentsModule
  ],
  declarations: [
    ContentComponent,
    ContentEventsComponent,
    ContentNotificationsComponent
  ]
})

export class ContentModule {}
