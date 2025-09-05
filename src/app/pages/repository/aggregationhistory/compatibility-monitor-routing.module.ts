import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompatibilityMonitorRepoComponent } from "./compatibility-monitor-repo.component";
import { authGuard } from "../../../services/auth-guard.service";
import { CompatibilityMonitorFullHistoryRepoComponent } from "./compatibility-monitor-fullHistory-repo.component";

const aggregationHistoryRoutes: Routes = [
  {
    path: '',
    component: CompatibilityMonitorRepoComponent,
    canActivate: [authGuard],
    data: {
      hasSidebar: true
    }
  },
  {
    path: 'fullHistory',
    component: CompatibilityMonitorFullHistoryRepoComponent,
    canActivate: [authGuard],
    data: {
      hasSidebar: true
    }
  }
];


@NgModule ({
  imports: [RouterModule.forChild(aggregationHistoryRoutes)],
  exports: [RouterModule]
})

export class AggregationHistoryRoutingModule {}

