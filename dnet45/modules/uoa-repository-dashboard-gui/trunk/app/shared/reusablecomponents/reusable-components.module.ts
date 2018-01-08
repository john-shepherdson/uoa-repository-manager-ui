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
import { MyGroup } from './forms/my-group.interface';
import { MyArray, MyArrayInline, MyArrayWrapper, MyInlineArrayWrapper } from './forms/my-array.interface';
import { MyChoice, MyChoiceComponents, MyChoiceWrapper } from './forms/my-choice.interface';
import { MyFormDirective } from './forms/my-form.directive';


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
    RepositoryTilesComponent,
    MyGroup,
/*
    MyInlineArrayWrapper,
    MyArrayWrapper,
    MyArray,
    MyArrayInline,
    MyChoiceWrapper,
    MyChoice,
    MyChoiceComponents,
    MyFormDirective
*/
  ],
  exports: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    RepositoryTilesComponent,
    MyGroup,
  ],
  providers: [
    HelpContentService
  ],
})

export class ReusableComponentsModule {
}
