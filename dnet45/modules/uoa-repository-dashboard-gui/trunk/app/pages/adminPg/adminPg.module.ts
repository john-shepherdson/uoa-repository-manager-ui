import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {AdminPgComponent} from "./adminPg.component";
import {AdminPgHelpTextsComponent} from "./adminPg-help-texts.component";
import {AdminPgRouting} from "./adminPg.routing";

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    AdminPgRouting
  ],
  declarations: [
    AdminPgComponent,
    AdminPgHelpTextsComponent
  ]
})

export class AdminPgModule {}
