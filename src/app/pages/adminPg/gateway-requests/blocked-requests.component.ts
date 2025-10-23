import { Component } from "@angular/core";
import { InputComponent } from "src/app/shared/input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from "@angular/common";
import { ReusableTableComponent } from "src/app/shared/reusable-table/reusable-table.component";
import { RequestsService } from "../../gateway-dashboard/services/request.service";
import { SharedService } from "src/app/services/shared.service";
import { RepositoryService } from "src/app/services/repository.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CommunityContextService } from "src/app/services/communityContext.service";
import { Observable } from "rxjs";
import { Paging } from "src/app/domain/paging";
import {Authority, Decision, Request} from 'src/app/pages/gateway-dashboard/domain/request.domain';
import {OpenaireActionsComponent} from './openaire-actions.component';

@Component({
    selector: 'blocked-requests',
    templateUrl: '../../gateway-dashboard/requests/requests.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReusableTableComponent,
        InputComponent,
        ReactiveFormsModule,
        MatPaginatorModule
    ]
})
export class BlockedRequestsComponent extends OpenaireActionsComponent {
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
        return this.requestsService.getBlockedRequests(params);
    }

  protected updateDecision(id: number, decision: Decision, authority: Authority, comment: string) {
    this.requestsService.updateRequestStatus(id, decision)
      .subscribe(super.reloadRequests);
  }
}
