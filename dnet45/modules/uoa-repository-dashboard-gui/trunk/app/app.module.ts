/**
 * Created by stefania on 10/3/16.
 */
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";

import {TabsModule, ModalModule} from "ngx-bootstrap";

import {AppRouting} from "./app.routing";
import {AppComponent} from "./app.component";
import {ConfirmationDialogComponent} from "./shared/confirmation-dialog.component";
import {UserModule} from "./user/user.module";
import {HomeComponent} from './pages/home/home.component';
import {TopMenuComponent} from './shared/topmenu/topmenu.component';
import {FooterComponent} from './shared/footer/footer.component';
import {MetricsModule} from './pages/metrics/metrics.module';


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
    UserModule
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    HomeComponent,
    ConfirmationDialogComponent,
  ],
  providers: [
//    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
