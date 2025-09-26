import { Component, OnInit } from "@angular/core";
import { CommunityService } from "src/app/services/community.service";
import { SharedService } from "src/app/services/shared.service";
import { Community } from "src/app/domain/community";
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


  constructor(private sharedService: SharedService, private communityService: CommunityService) {}

  ngOnInit(): void {
    if(this.sharedService.getRepository()) {
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

  }
}
