import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {CompatibilityComponent} from "./compatibility.component";
import {CompatibilityValidateComponent} from "./compatibility-validate.component";
import {CompatibilityRouting} from "./compatibility.routing";
import {CompatibilityMonitorComponent} from "./compatibility-monitor.component";
import { CompatibilityValidationHistoryComponent } from './compatibility-validation-history.component';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { CompatibilityMonitorRepoComponent } from './compatibility-monitor-repo.component';
import { CompatibilityValidateTypeComponent } from './compatibility-validate-type.component';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    CompatibilityRouting,
    ReusableComponentsModule
  ],
  declarations: [
    CompatibilityComponent,
    CompatibilityValidateComponent,
    CompatibilityValidationHistoryComponent,
    CompatibilityMonitorComponent,
    CompatibilityMonitorRepoComponent,
    CompatibilityValidateTypeComponent
  ]
})

export class CompatibilityModule {}
