/**
 * Created by stefania on 10/3/16.
 */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';

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
import {HttpClientModule} from '@angular/common/http';
import {RepositoryService} from "./services/repository.service";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
      RepositoryService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
