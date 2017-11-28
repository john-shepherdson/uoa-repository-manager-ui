import {NgModule} from '@angular/core';
import {SourcesRouting} from './sources.routing';
import {SourcesComponent} from './sources.component';
import {SourcesRegisterComponent} from './sources-register.component';
import {CommonModule} from '@angular/common';
import {TabsModule} from 'ngx-bootstrap';

@NgModule ({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    SourcesRouting
  ],
  declarations: [
    SourcesComponent,
    SourcesRegisterComponent
  ]
})

export class SourcesModule {}
