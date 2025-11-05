import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
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
import { CompatibilityValidationCrisResultsComponent } from './compatibility-validation-cris-results.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatStepperModule } from '@angular/material/stepper';
import { InputComponent } from '../../shared/input.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CompatibilityRouting,
    ReusableComponentsModule,
    HighchartsChartModule,
    MatStepperModule,
    InputComponent,
    MatPaginatorModule
  ],
  declarations: [
    CompatibilityComponent,
    CompatibilityValidateComponent,
    CompatibilityValidationHistoryComponent,
    CompatibilityValidationResultsComponent,
    CompatibilityValidationCrisResultsComponent,
    CompatibilityValidateTypeComponent,
    CompatibilityValidateStep1Component,
    CompatibilityValidateStep2Component,
    CompatibilityValidateStep3Component,
    CompatibilityValidateStep3CrisComponent
  ]
})

export class CompatibilityModule {}
