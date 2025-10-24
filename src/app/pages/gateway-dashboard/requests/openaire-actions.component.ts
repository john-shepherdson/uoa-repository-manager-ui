import {Component} from '@angular/core';
import {BASE_IMPORTS, BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import {RequestsService} from '../services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Authority, Decision, Request} from '../domain/request.domain';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Paging} from 'src/app/domain/paging';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'openaire-actions',
  templateUrl: './requests.component.html',
  standalone: true,
  imports: [
    ...BASE_IMPORTS,
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
    }
    this.updateDecision(request.id, decision, authority, comment);
  }
}
