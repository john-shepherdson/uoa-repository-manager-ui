import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {CompatibilityComponent} from "./compatibility.component";
import {CompatibilityValidationComponent} from "./compatibility-validation.component";
import {CompatibilityRouting} from "./compatibility.routing";
import {CompatibilityMonitorComponent} from "./compatibility-monitor.component";

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    CompatibilityRouting
  ],
  declarations: [
    CompatibilityComponent,
    CompatibilityValidationComponent,
    CompatibilityMonitorComponent
  ]
})

export class CompatibilityModule {}
