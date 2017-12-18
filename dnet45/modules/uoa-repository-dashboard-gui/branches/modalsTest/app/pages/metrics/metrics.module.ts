/**
 * Created by myrto on 11/27/17.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ModalModule, TabsModule} from "ngx-bootstrap";
import { MetricsComponent } from "./metrics.component";
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { MetricsRouting } from './metrics.routing';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule ({
  imports: [
    CommonModule,
    FormsModule,
    MetricsRouting,
    SharedModule
  ],
  declarations: [
    MetricsComponent,
    MetricsEnableComponent,
    MetricsInstructionsComponent,
//    ConfirmationDialogComponent
  ]
})

export class MetricsModule { }
