import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GatewaySidebarComponent } from './side-menu/gateway-sidebar.component';
import { NgIf } from '@angular/common';
import { CommunityContextService } from "../../services/communityContext.service";
import { StickyFooterComponent } from 'src/app/shared/sticky-footer/sticky-footer.component';

@Component({
  selector: 'gateway-dashboard',
  templateUrl: './gateway-dashboard.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    GatewaySidebarComponent,
    NgIf,
    StickyFooterComponent
  ]
})

export class GatewayDashboardComponent implements OnInit {
  open = true;
  hasSidebar = true;
  hasAdminMenu = false;
  hover = false;

  communityId?: string;

  constructor(private communityService: CommunityContextService) {}

  ngOnInit() {
    this.communityService.getCurrentCommunityId().subscribe({
      next: (communityId) => {
        this.communityId = communityId;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onHoverChange(state: boolean) {
    this.hover = state;
  }
}
