/**
 * Created by stefania on 4/6/17.
 */
import { InlineFormWrapper, MyGroup } from './forms/my-group.interface';
import { MyArray, MyArrayInline, MyArrayWrapper, MyInlineArrayWrapper } from './forms/my-array.interface';
import { MyFormDirective } from './forms/my-form.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AsideHelpContentComponent, HelpContentComponent } from './help-content.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { RepositoryTilesComponent } from './repository-tiles.component';
import { ForbiddenPageComponent } from './403-forbidden-page.component';
import { HelpContentService } from '../../services/help-content.service';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { TopmenuLandingComponent } from '../topmenulanding/topmenu-landing.component';
import { FooterComponent } from '../footer/footer.component';
import { ReadMoreComponent, ReadMoreTextComponent } from './read-more.component';
import { SideMenuComponent } from "../sidemenu/sidemenu.component";
import {TopmenuDashboardComponent} from "../topmenudashboard/topmenu-dashboard.component";

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
    CommonModule,
    RouterModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  entryComponents : [
    MyArrayWrapper
  ],
  declarations: [
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    TopmenuLandingComponent,
    TopmenuDashboardComponent,
    SideMenuComponent,
    FooterComponent,
    RepositoryTilesComponent,
    ForbiddenPageComponent,
    ReadMoreComponent,
    ReadMoreTextComponent,
    ...myGroups
  ],
  exports: [
    HelpContentComponent,
    AsideHelpContentComponent,
    ConfirmationDialogComponent,
    TopmenuLandingComponent,
    TopmenuDashboardComponent,
    SideMenuComponent,
    FooterComponent,
    RepositoryTilesComponent,
    ForbiddenPageComponent,
    ...myGroups,
    ReadMoreComponent
  ],
  providers: [
    HelpContentService
  ],
})

export class ReusableComponentsModule {
}
