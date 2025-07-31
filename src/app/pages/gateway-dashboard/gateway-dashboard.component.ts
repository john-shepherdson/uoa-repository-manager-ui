import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GatewaySidebarComponent } from './side-menu/gateway-sidebar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'gateway-dashboard',
  templateUrl: './gateway-dashboard.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    GatewaySidebarComponent,
    NgIf
  ]
})

export class GatewayDashboardComponent {
  open = true;
  hasSidebar = true;
  hasAdminMenu = false;
  hover = false;


  onHoverChange(state: boolean) {
    this.hover = state;
  }
}
