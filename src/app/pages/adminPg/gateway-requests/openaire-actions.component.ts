import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReusableTableComponent } from "src/app/shared/reusable-table/reusable-table.component";
import { BaseGatewayRequestsComponent } from "./base-gateway-requests.component";
import { RequestsService } from "../../gateway-dashboard/services/request.service";
import { SharedService } from "src/app/services/shared.service";
import { RepositoryService } from "src/app/services/repository.service";
import { Request } from "../../gateway-dashboard/domain/request.domain";
import { CommunityContextService } from "src/app/services/communityContext.service";
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from "rxjs";
import { Paging } from "src/app/domain/paging";
import { InputComponent } from "src/app/shared/input.component";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
 selector: 'openaire-actions',
 templateUrl: '../../gateway-dashboard/requests/requests.component.html',
standalone: true,
imports: [
 CommonModule,
 InputComponent,
ReusableTableComponent,
ReactiveFormsModule
 ]
})
export class OpenaireActionsComponent extends BaseGatewayRequestsComponent {

 constructor(
 protected requestsService: RequestsService,
 protected sharedService: SharedService,
 protected repositoryService: RepositoryService,
 protected router: Router,
 protected route: ActivatedRoute,
protected communityService: CommunityContextService) {
 
 super(requestsService, sharedService, repositoryService, router, route, communityService);
 this.showActionsColumn = true;
 
}
 
 protected getRequests(params: any): Observable<Paging<Request>> {
 return this.requestsService.getOpenaireActions(params);
 }
}