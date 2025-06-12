import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { ReusableComponentsModule } from '../../../shared/reusablecomponents/reusable-components.module';
import { EventsRoutingModule } from './events-routing.module';
import { ContentEventsOfRepositoryComponent } from './content-events-of-repository.component';
import { ContentEventsOfRepoEventslistComponent } from './content-events-of-repo-eventslist.component';
import { ReactiveFormsModule } from '@angular/forms';
import {InputComponent} from '../../../shared/input.component';


@NgModule ({
    imports: [
        CommonModule,
        TabsModule.forRoot(),
        EventsRoutingModule,
        ReusableComponentsModule,
        ReactiveFormsModule,
        InputComponent,
    ],
  declarations: [
    ContentEventsOfRepositoryComponent,
    ContentEventsOfRepoEventslistComponent
  ]
})

export class EventsModule { }
