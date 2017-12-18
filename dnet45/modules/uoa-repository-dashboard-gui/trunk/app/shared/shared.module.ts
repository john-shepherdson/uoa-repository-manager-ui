/**
 * Created by myrto on 12/18/17.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ModalModule, TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    ConfirmationDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent
  ]
})

export class SharedModule {}
