/**
 * Created by stefania on 7/5/16.
 */
import {Component, Input, OnInit} from '@angular/core';
import {Repository} from '../../../domain/typeScriptClasses';

@Component({
  selector: 'app-repo-side-menu',
  templateUrl: './repository-sidebar.component.html',
})

export class RepositorySideMenuComponent implements OnInit {

  toggle: number[] = [];

  @Input() repository: Repository;

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
}
