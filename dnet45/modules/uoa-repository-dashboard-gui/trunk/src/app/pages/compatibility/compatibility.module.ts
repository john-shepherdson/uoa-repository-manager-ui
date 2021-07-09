import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompatibilityRouting } from './compatibility.routing';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { CompatibilityComponent } from './compatibility.component';
import { CompatibilityValidateComponent } from './compatibility-validate.component';
import { CompatibilityValidationHistoryComponent } from './compatibility-validation-history.component';
import { CompatibilityValidationResultsComponent } from './compatibility-validation-results.component';
import { CompatibilityValidateTypeComponent } from './compatibility-validate-type.component';
import { CompatibilityValidateStep1Component } from './compatibility-validate-forms/compatibility-validate-step1.component';
import { CompatibilityValidateStep2Component } from './compatibility-validate-forms/compatibility-validate-step2.component';
import { CompatibilityValidateStep3Component } from './compatibility-validate-forms/compatibility-validate-step3.component';
import { CompatibilityValidateStep3CrisComponent } from './compatibility-validate-forms/compatibility-validate-step3-cris.component';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CompatibilityRouting,
    ReusableComponentsModule,
    HighchartsChartModule
  ],
  declarations: [
    CompatibilityComponent,
    CompatibilityValidateComponent,
    CompatibilityValidationHistoryComponent,
    CompatibilityValidationResultsComponent,
    CompatibilityValidateTypeComponent,
    CompatibilityValidateStep1Component,
    CompatibilityValidateStep2Component,
    CompatibilityValidateStep3Component,
    CompatibilityValidateStep3CrisComponent
  ]
})

export class CompatibilityModule {}
