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
import { LandingComponent } from "./pages/landing/landing.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { UsagestatsService } from './services/usagestats.service';
import { AuthenticationInterceptor } from "./services/authentication-interceptor";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CookieLawModule } from "./shared/reusablecomponents/cookie-law/cookie-law.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ReusableComponentsModule } from './shared/reusablecomponents/reusable-components.module';
import { StatisticsService } from './services/statistics.service';


@NgModule({
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    ModalModule.forRoot(),
    TabsModule,
    ReusableComponentsModule,
    CookieLawModule,
    AppRouting,
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    LandingComponent,
    DashboardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    BrokerService,
    MonitorService,
    PiwikService,
    RepositoryService,
    ValidatorService,
    UsagestatsService,
    StatisticsService,
    AuthGuardService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
