/**
 * Created by myrto on 11/27/17.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetricsComponent } from "./metrics.component";
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { MetricsRouting } from './metrics.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule ({
  imports: [
    CommonModule,
    MetricsRouting,
    SharedModule
  ],
  declarations: [
    MetricsComponent,
    MetricsEnableComponent,
    MetricsInstructionsComponent
  ]
})

export class MetricsModule { }
