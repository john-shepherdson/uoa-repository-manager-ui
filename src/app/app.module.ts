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
import { AuthenticationService } from './services/authentication.service';
import { MatomoRouterModule, MatomoModule } from 'ngx-matomo-client';
import { DashboardService } from './services/dashboard.service';
import { EmptyPageComponent } from './pages/emptypage/empty-page.component';
import { SharedService } from './services/shared.service';
import { JoinComponent } from './pages/join/join.component';
import { AboutComponent } from './pages/landing/about/about.component';
import { environment } from '../environments/environment';
import { MyDataSourcesComponent } from './pages/my-datasources/my-data-sources.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { MatStepperModule } from "@angular/material/stepper";
import { GatewayHomeComponent } from "./pages/landing/home-pages/gateway/gateway-home.component";



@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    EmptyPageComponent,
    JoinComponent,
    MyDataSourcesComponent,
    MyRequestsComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReusableComponentsModule,
    CookieLawModule,
    MatomoModule.forRoot({
        scriptUrl: environment.MATOMO_URL + 'matomo.js',
        trackers: [
            {
                trackerUrl: environment.MATOMO_URL + 'matomo.php',
                siteId: environment.MATOMO_SITE
            }
        ]
    }),
    MatomoRouterModule.forRoot({}),
    AppRoutingModule,
    MatStepperModule,
    GatewayHomeComponent
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
    DashboardService,
    ValidatorService,
    UsagestatsService,
    StatisticsService,
    AuthenticationService,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
