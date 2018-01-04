import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import { CKEditorModule } from 'ng2-ckeditor';

import {AdminPgComponent} from "./adminPg.component";
import {AdminPgHelpTextsComponent} from "./adminPg-help-texts.component";
import {AdminPgRouting} from "./adminPg.routing";
import {AdminPgMetricsComponent} from './adminPg-metrics.component';
import { ReusableComponentsModule } from '../../shared/reusablecomponents/reusable-components.module';
import { FormsModule } from '@angular/forms';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    CKEditorModule,
    AdminPgRouting,
    ReusableComponentsModule
  ],
  declarations: [
    AdminPgComponent,
    AdminPgHelpTextsComponent,
    AdminPgMetricsComponent
  ]
})

export class AdminPgModule {}
