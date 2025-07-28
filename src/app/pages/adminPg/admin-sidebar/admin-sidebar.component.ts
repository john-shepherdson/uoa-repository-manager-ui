/**
 * Created by stefania on 7/5/16.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Repository} from '../../../domain/typeScriptClasses';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-admin-side-menu',
  templateUrl: './admin-sidebar.component.html',
})

export class AdminSideMenuComponent implements OnInit {

  adminHomePage = environment.FAQ_HOMEPAGE;
  toggle: number[] = [];

  @Input() repository: Repository;

  @Output() hoverChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onClick(id: string) {
    const el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }
  toggleSidebar() {

    const el: HTMLElement | null = document.getElementById('sidebar');
    if (el === null) {
      return;
    }

    if (!el.classList.contains('sidebar_mini')) {
      el.classList.add('sidebar_mini');
      el.classList.remove('sidebar_main_active');
    } else {
      el.classList.add('sidebar_main_active');
      el.classList.remove('sidebar_mini');
    }
  }

  onMouseEnter() {
    this.hoverChange.emit(true);
  }

  onMouseLeave() {
    this.hoverChange.emit(false);
  }

}
