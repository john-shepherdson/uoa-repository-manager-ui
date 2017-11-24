import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import {LoginComponent} from "./login/login.component";
import {UserRouting} from "./user.routing";
import {TabsModule} from "ngx-bootstrap";
import {RegisterComponent} from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    UserRouting,
    TabsModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})

export class UserModule {}
