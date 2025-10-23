import {Component, OnInit} from '@angular/core';
import {CommunityService} from 'src/app/services/community.service';
import {SharedService} from 'src/app/services/shared.service';
import {Community} from 'src/app/domain/community';
import {RequestsService} from 'src/app/pages/gateway-dashboard/services/request.service';
import {Authority, Decision, Request} from 'src/app/pages/gateway-dashboard/domain/request.domain';
import {Paging} from 'src/app/domain/paging';
// CommonModule / NgIf should be provided by the NgModule that declares this component.
// Do not import from node_modules paths in source files.
@Component({
  selector: 'app-repository-gateways',
  templateUrl: './gateways.component.html',

})
export class GatewaysComponent implements OnInit {
  primaryGatewayId: string;
  affiliatedGatewaysIds: string[] = [];
  primaryCommunity: Community;
  affiliatedCommunities: Community[] = [];
  requests: Paging<Request> | null = null;


  constructor(private sharedService: SharedService,
              private communityService: CommunityService,
              private requestsService: RequestsService) {
  }

  ngOnInit(): void {
    if (this.sharedService.getRepository()) {
      this.primaryGatewayId = this.sharedService.getRepository().primaryProvideGateway;
      this.affiliatedGatewaysIds = this.sharedService.getRepository().affiliatedProvideGateways || [];
    }

    this.communityService.getCommunityById(this.primaryGatewayId).subscribe({
      next: (community: Community) => {
        console.log('Primary community: ', community);
        this.primaryCommunity = community;
        // this.affiliatedGatewaysIds = community.affiliatedGateways || [];
      }
    });

    this.affiliatedGatewaysIds.forEach(gatewayId => {
      this.communityService.getCommunityById(gatewayId).subscribe({
        next: (community: Community) => {
          console.log('Affiliated community: ', community);
          this.affiliatedCommunities.push(community);
        }
      });
    });
    // Load requests for this repository (datasource) if available
    const repo = this.sharedService.getRepository();
    if (repo && repo.id) {
      this.requestsService.getAllRequests({datasourceIds: repo.id, size: 100}).subscribe({
        next: (data) => this.requests = data,
        error: (err) => console.error('Failed to load requests for repo', repo.id, err)
      });
    }
  }

  approveRequest(requestId: number) {
    console.log('Approve request', requestId);
    this.requestsService.createRequestDecision(requestId, Decision.APPROVED, Authority.TARGET_GATEWAY_ADMIN, 'Approved by admin')
      .subscribe({
        next: (res) => {
          console.log('Request approved:', res);
        },
        error: (err) => {
          console.error('Error approving request:', err);
        }
      });
  }

  rejectRequest(requestId: number) {
    console.log('Reject request', requestId);
    this.requestsService.createRequestDecision(requestId, Decision.REJECTED, Authority.TARGET_GATEWAY_ADMIN, 'Rejected by admin')
      .subscribe({
        next: (res) => {
          console.log('Request rejected:', res);
        },
        error: (err) => {
          console.error('Error rejecting request:', err);
        }
      });
  }

}
