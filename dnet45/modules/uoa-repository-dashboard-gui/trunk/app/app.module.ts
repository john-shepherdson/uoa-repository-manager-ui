/**
 * Created by stefania on 10/3/16.
 */
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {appRoutingProviders, routing} from "./app.routing";
import {AppComponent} from "./app.component";
import {TopMenuComponent} from "./shared/topmenu/topmenu.component";
import {TabsModule, ModalModule} from "ngx-bootstrap";
import {FooterComponent} from "./shared/footer/footer.component";
import {ConfirmationDialogComponent} from "./shared/confirmation-dialog.component";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    ModalModule.forRoot(),
    routing,
    TabsModule,
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
