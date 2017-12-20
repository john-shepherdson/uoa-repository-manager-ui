/**
 * Created by myrto on 11/27/17.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetricsComponent } from "./metrics.component";
import { MetricsEnableComponent } from './metrics-enable.component';
import { MetricsInstructionsComponent } from './metrics-instructions.component';
import { MetricsRouting } from './metrics.routing';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { SharedModule } from '../../shared/shared.module';
import { MetricsShowComponent } from './metrics-show.component';

@NgModule ({
  imports: [
    CommonModule,
    MetricsRouting,
    SharedModule,
    ReusableComponentsModule
  ],
  declarations: [
    MetricsComponent,
    MetricsEnableComponent,
    MetricsInstructionsComponent,
    MetricsShowComponent
  ]
})

export class MetricsModule { }
