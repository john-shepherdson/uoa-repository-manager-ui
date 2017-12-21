/**
 * Created by stefania on 4/6/17.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";

import { ReadMoreComponent } from "./read-more.component";
import { AsideHelpContentComponent, HelpContentComponent } from "./help-content.component";
import { HelpContentService } from "../../services/help-content.service";
import { RepositoryTilesComponent } from './repository-tiles.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    RepositoryTilesComponent
  ],
  exports: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    RepositoryTilesComponent
  ],
  providers: [
    HelpContentService
  ],
})

export class ReusableComponentsModule {
}
