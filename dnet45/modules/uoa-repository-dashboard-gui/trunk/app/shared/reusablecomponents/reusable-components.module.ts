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
import { InlineFormWrapper, MyGroup } from './forms/my-group.interface';
import { MyArray, MyArrayInline, MyArrayWrapper, MyInlineArrayWrapper } from './forms/my-array.interface';
import { MyFormDirective } from './forms/my-form.directive';
import { RouterModule } from '@angular/router';

const myGroups = [
  MyGroup,
  MyArray,
  MyArrayWrapper,
  MyArrayInline,
  MyFormDirective,
  MyInlineArrayWrapper,
  InlineFormWrapper
];

@NgModule({
  imports: [
    //BrowserModule,
    CommonModule,
    RouterModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule
  ],
  entryComponents : [
    MyArrayWrapper
  ],
  declarations: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    RepositoryTilesComponent,
    ...myGroups
/*
    MyChoiceWrapper,
    MyChoice,
    MyChoiceComponents,
*/
  ],
  exports: [
    ReadMoreComponent,
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    RepositoryTilesComponent,
    ...myGroups
  ],
  providers: [
    HelpContentService
  ],
})

export class ReusableComponentsModule {
}
