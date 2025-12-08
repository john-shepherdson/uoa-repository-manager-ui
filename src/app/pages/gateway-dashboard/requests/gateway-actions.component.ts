import {Component} from '@angular/core';
import {RequestsService} from '../services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Authority, Decision, Request} from '../domain/request.domain';
import {Paging} from 'src/app/domain/paging';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BASE_IMPORTS, BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import {CommunityContextService} from 'src/app/services/communityContext.service';

@Component({
  selector: 'gateway-actions',
  templateUrl: './requests.component.html',
  standalone: true,
  imports: [
    ...BASE_IMPORTS,
  ]
})

export class GatewayActionsComponent extends BaseGatewayRequestsComponent {
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
    return this.requestsService.getGatewayActions(params);
  }

  override handleDecision(event: { request: Request; decision: Decision; comment?: string }) {
    const { request, decision, comment } = event;
    this.updateDecision(request.id, decision, Authority.DATASOURCE_ADMIN, comment || '');
  }

  override checkIfActionsAllowed(request: Request): boolean {
    const sourcePending = !request.sourceGatewayApproval || request.sourceGatewayApproval.decision === 'PENDING';
    const datasourcePending = !request.ownerApproval || request.ownerApproval.decision === 'PENDING';
    return sourcePending && datasourcePending;
  }
}
