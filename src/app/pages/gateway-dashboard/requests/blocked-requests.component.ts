import {Component} from '@angular/core';
import {BASE_IMPORTS, BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import {RequestsService} from '../services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {Observable} from 'rxjs';
import {Paging} from 'src/app/domain/paging';
import {Authority, Decision, Request} from 'src/app/pages/gateway-dashboard/domain/request.domain';
import {OpenaireActionsComponent} from './openaire-actions.component';

@Component({
  selector: 'blocked-requests',
  templateUrl: './requests.component.html',
  standalone: true,
  imports: [
    ...BASE_IMPORTS,
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
    console.warn('Comment is ignored.');
    this.requestsService.updateRequestStatus(id, decision)
      .subscribe(() => this.reloadRequests.next({}));
  }
}
