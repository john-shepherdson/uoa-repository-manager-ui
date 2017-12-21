/**
 * Created by stefania on 4/6/17.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { ModalModule, TabsModule } from 'ngx-bootstrap';

import { ReadMoreComponent } from "./read-more.component";
import { AsideHelpContentComponent, HelpContentComponent } from "./help-content.component";
import { HelpContentService } from "../../services/help-content.service";
import { RepositoryTilesComponent } from './repository-tiles.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    RepositoryTilesComponent
  ],
  exports: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    RepositoryTilesComponent
  ],
  providers: [
    HelpContentService
  ],
})

export class ReusableComponentsModule {
}
