import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ReusableTableComponent} from 'src/app/shared/reusable-table/reusable-table.component';
import {BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import {RequestsService} from '../../gateway-dashboard/services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Authority, Decision, Request} from '../../gateway-dashboard/domain/request.domain';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Paging} from 'src/app/domain/paging';
import {InputComponent} from 'src/app/shared/input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'openaire-actions',
  templateUrl: '../../gateway-dashboard/requests/requests.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReusableTableComponent,
    ReactiveFormsModule,
    MatPaginatorModule
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

  handleDecision(event: { request: Request; decision: Decision; comment?: string }) {
    const {request, decision, comment} = event;

    let authority: Authority;
    if (request.sourceGateway.id === environment.OPENAIRE_ID) {
      authority = Authority.SOURCE_GATEWAY_ADMIN;
    } else if (request.targetGateway.id === environment.OPENAIRE_ID) {
      authority = Authority.TARGET_GATEWAY_ADMIN;
    }/* else {
      console.error('Current community is neither source nor target for this request');
      this.loadingMessage = null;
      this.errorMessage = 'Current community is neither source nor target for this request';
      return;
    }*/
    if (!!authority) {
      this.updateDecision(request.id, decision, authority, comment);
    } else {
      console.log('About to approve blocked resource.');
      // TODO: Use another method to APPROVE the BLOCKED request
      //  or create new component for handling disputes.
    }
  }
}
