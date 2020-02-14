import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompatibilityMonitorRepoComponent } from "./compatibility-monitor-repo.component";
import { AuthGuardService } from "../../../services/auth-guard.service";
import { CompatibilityMonitorFullHistoryRepoComponent } from "./compatibility-monitor-fullHistory-repo.component";

const aggregationHistoryRoutes: Routes = [
  {
    path: '',
    component: CompatibilityMonitorRepoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'fullHistory',
    component: CompatibilityMonitorFullHistoryRepoComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(aggregationHistoryRoutes)],
  exports: [RouterModule]
})

export class AggregationHistoryRoutingModule {}

