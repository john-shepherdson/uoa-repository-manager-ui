/*
*  updated by myrto on 19/12/2018
*/

import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-admin',
  templateUrl: './adminPg.component.html'
})

export class AdminPgComponent implements OnInit {

  open = true;
  hasSidebar = true;
  hasAdminMenu = false;
  hover = false;

  constructor() {}

  ngOnInit() {}

  onHoverChange(state: boolean) {
    this.hover = state;
  }
}
