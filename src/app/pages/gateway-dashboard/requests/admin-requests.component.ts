import {Component} from '@angular/core';
import {RequestsService} from '../services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Request} from '../domain/request.domain';
import {Paging} from 'src/app/domain/paging';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BASE_IMPORTS, BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import {CommunityContextService} from 'src/app/services/communityContext.service';


@Component({
  selector: 'gateway-requests',
  templateUrl: './requests.component.html',
  standalone: true,
  imports: [
    ...BASE_IMPORTS
  ]
})

export class AdminRequestsComponent extends BaseGatewayRequestsComponent {

  constructor(
    protected requestsService: RequestsService,
    protected sharedService: SharedService,
    protected repositoryService: RepositoryService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected communityService: CommunityContextService) {
    super(requestsService, sharedService, repositoryService, router, route, communityService);
    this.showActionsColumn = false;
  }

  protected getRequests(params: any): Observable<Paging<Request>> {
    return this.requestsService.getAllRequests(params);
  }
}
