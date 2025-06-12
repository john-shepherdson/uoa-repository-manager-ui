/*
*  updated by myrto on 19/12/2018
*/

import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-admin',
  // templateUrl: '../pageContainer.html'
  templateUrl: './adminPg.component.html'
})

export class AdminPgComponent implements OnInit {

  open = true;
  hasSidebar = true;
  hasAdminMenu = false;

  //fixme make true if it is hover
  hover = false;

  constructor() {}

  ngOnInit() {}
}
