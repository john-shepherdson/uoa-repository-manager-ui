import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TabsModule} from "ngx-bootstrap";
import {PagesRouting} from "./pages.routing";
import {HomeComponent} from "./home/home.component";
import {MetricsComponent} from "./metrics/metrics.component";
import {PagesComponent} from "./pages.component";
import {TopMenuComponent} from "../shared/topmenu/topmenu.component";
import {FooterComponent} from "../shared/footer/footer.component";
import {DnspaceStartComponent} from './metrics/dnspace-start.component';
import {InstructionsComponent} from './metrics/instructions.component';

@NgModule ({
  imports: [
    CommonModule,
    PagesRouting,
    TabsModule.forRoot()
  ],
  declarations: [
    TopMenuComponent,
    FooterComponent,
    PagesComponent,
    HomeComponent,
    MetricsComponent,
    DnspaceStartComponent,
    InstructionsComponent
  ]
})

export class PagesModule { }
