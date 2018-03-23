/**
 * Created by stefania on 10/3/16.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { TabsModule, ModalModule } from 'ngx-bootstrap';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './shared/topmenu/topmenu.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MetricsModule } from './pages/metrics/metrics.module';
import { SourcesModule } from './pages/sources/sources.module';
import { CompatibilityModule } from './pages/compatibility/compatibility.module';
import { ContentModule } from './pages/content/content.module';
import { AdminPgModule } from './pages/adminPg/adminPg.module';
import { RepositoryService } from "./services/repository.service";
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ValidatorService } from './services/validator.service';
import { PiwikService } from './services/piwik.service';
import { BrokerService } from './services/broker.service';
import { MonitorService } from './services/monitor.service';
import {LandingComponent} from "./pages/landing/landing.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    ModalModule.forRoot(),
//    routing,
    AppRouting,
    TabsModule,
    MetricsModule,
    SourcesModule,
    CompatibilityModule,
    ContentModule,
    AdminPgModule
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    LandingComponent,
    DashboardComponent
  ],
  providers: [
//    appRoutingProviders
    BrokerService,
    MonitorService,
    PiwikService,
    RepositoryService,
    ValidatorService,
    AuthGuardService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
