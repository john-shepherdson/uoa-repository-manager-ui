import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReusableComponentsModule } from './shared/reusablecomponents/reusable-components.module';
import { CookieLawModule } from './shared/reusablecomponents/cookie-law/cookie-law.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationInterceptor } from './services/authentication-interceptor';
import { BrokerService } from './services/broker.service';
import { MonitorService } from './services/monitor.service';
import { PiwikService } from './services/piwik.service';
import { RepositoryService } from './services/repository.service';
import { ValidatorService } from './services/validator.service';
import { UsagestatsService } from './services/usagestats.service';
import { StatisticsService } from './services/statistics.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatomoModule } from 'ngx-matomo';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReusableComponentsModule,
    CookieLawModule,
    MatomoModule,
    AppRoutingModule
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
export class AppModule { }
