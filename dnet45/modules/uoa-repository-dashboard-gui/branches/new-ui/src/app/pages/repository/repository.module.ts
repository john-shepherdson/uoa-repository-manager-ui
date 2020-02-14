import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepositoryComponent } from "./repository.component";
import { RepositoryRoutingModule } from "./repository-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {AuthenticationInterceptor} from "../../services/authentication-interceptor";
import {UsagestatsService} from "../../services/usagestats.service";
import {RepositoryService} from "../../services/repository.service";
import {AuthGuardService} from "../../services/auth-guard.service";
import {ValidatorService} from "../../services/validator.service";
import {AuthenticationService} from "../../services/authentication.service";
import {MonitorService} from "../../services/monitor.service";
import {PiwikService} from "../../services/piwik.service";
import {StatisticsService} from "../../services/statistics.service";
import {BrokerService} from "../../services/broker.service";
import {DashboardService} from "../../services/dashboard.service";
import { SharedService } from "../../services/shared.service";
import { SourcesUpdateRepoComponent } from "./update/sources-update-repo.component";

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    // SourcesRouting,
    RepositoryRoutingModule,
    ReusableComponentsModule
  ],
  declarations: [
    RepositoryComponent,
    DashboardComponent,
    SourcesUpdateRepoComponent,
    // SourcesComponent,
    // SourcesRegisterComponent,
    // SourcesUpdateComponent,
    // RegisterNewDatasourceComponent,
    // RegisterExistingDatasourceComponent,
    // SrLiteratureComponent,
    // SrDataComponent,
    // SrJournalComponent,
    // SrAggregatorComponent,
    // SourcesUpdateRepoComponent,
    // RegisterDatasourceSelectExistingComponent,
    // DatasourceUpdateFormComponent,
    // DatasourceCreateFormComponent,
    // DatasourceNewInterfaceFormComponent,
    // RepoFilter                           // a pipe that searches for string in repository name
  ],
  providers: [
    SharedService
  ],
})

export class RepositoryModule {}
