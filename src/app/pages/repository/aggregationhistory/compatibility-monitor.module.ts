import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableComponentsModule } from '../../../shared/reusablecomponents/reusable-components.module';
import { AggregationHistoryRoutingModule } from './compatibility-monitor-routing.module';
import { CompatibilityMonitorRepoComponent } from './compatibility-monitor-repo.component';
import { CompatibilityMonitorFullHistoryRepoComponent } from './compatibility-monitor-fullHistory-repo.component';

@NgModule ({
  imports: [
    CommonModule,
    AggregationHistoryRoutingModule,
    ReusableComponentsModule
  ],
  declarations: [
    CompatibilityMonitorRepoComponent,
    CompatibilityMonitorFullHistoryRepoComponent
  ]
})

export class AggregationHistoryModule { }
