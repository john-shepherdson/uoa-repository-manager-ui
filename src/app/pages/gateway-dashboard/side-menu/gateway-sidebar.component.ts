import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'gateway-sidebar',
  templateUrl: './gateway-sidebar.component.html',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  standalone: true
})

export class GatewaySidebarComponent {

  @Output() hoverChange = new EventEmitter<boolean>();

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
