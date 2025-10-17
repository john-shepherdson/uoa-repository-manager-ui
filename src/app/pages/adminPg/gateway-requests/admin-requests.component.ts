import {Component} from '@angular/core';
import {RequestsService} from '../../gateway-dashboard/services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Request} from '../../gateway-dashboard/domain/request.domain';
import {Paging} from 'src/app/domain/paging';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import { CommunityContextService } from 'src/app/services/communityContext.service';


@Component({
  selector: 'gateway-requests',
  templateUrl: '../../gateway-dashboard/requests/requests.component.html'
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
  }

  protected getRequests(params: any): Observable<Paging<Request>> {
    return this.requestsService.getAllRequests(params);
  }
}
