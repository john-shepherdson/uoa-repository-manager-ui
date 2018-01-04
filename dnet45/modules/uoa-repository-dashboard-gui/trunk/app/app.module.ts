/**
 * Created by stefania on 10/3/16.
 */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import {TabsModule, ModalModule} from 'ngx-bootstrap';

import {AppRouting} from './app.routing';
import {AppComponent} from './app.component';
import {UserModule} from './user/user.module';
import {HomeComponent} from './pages/home/home.component';
import {TopMenuComponent} from './shared/topmenu/topmenu.component';
import {FooterComponent} from './shared/footer/footer.component';
import {MetricsModule} from './pages/metrics/metrics.module';
import {SourcesModule} from './pages/sources/sources.module';
import {CompatibilityModule} from './pages/compatibility/compatibility.module';
import {ContentModule} from './pages/content/content.module';
import {AdminPgModule} from './pages/adminPg/adminPg.module';
import {RepositoryService} from "./services/repository.service";
import {AuthenticationService} from './services/authentication.service';
import {AuthGuardService} from './services/auth-guard.service';


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
    AdminPgModule,
    UserModule
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    HomeComponent,
  ],
  providers: [
//    appRoutingProviders
    RepositoryService,
    AuthGuardService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
