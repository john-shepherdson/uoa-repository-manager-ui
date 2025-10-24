import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../services/shared.service';
import {RequestsService} from '../gateway-dashboard/services/request.service';
import {RepositorySnippet} from '../../domain/typeScriptClasses';
import {RepositoryService} from 'src/app/services/repository.service';
import {Authority, Decision, Request} from '../gateway-dashboard/domain/request.domain';
import {NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {Paging} from '../../domain/paging';
import {ActivatedRoute, Router} from '@angular/router';
import {CommunityContextService} from '../../services/communityContext.service';
import {BASE_IMPORTS, BaseGatewayRequestsComponent} from '../gateway-dashboard/requests/base-gateway-requests.component';


@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ...BASE_IMPORTS
  ]
})
export class MyRequestsComponent extends BaseGatewayRequestsComponent implements OnInit {
  repositories: RepositorySnippet[] = [];
  loading = false;
  requestsMap: Map<string, Request[]> = new Map();
  foundRequest: boolean = false;

  constructor(protected sharedService: SharedService, protected requestsService: RequestsService, protected repositoryService: RepositoryService,
              protected router: Router, protected route: ActivatedRoute, protected communityService: CommunityContextService) {
    super(requestsService, sharedService, repositoryService, router, route, communityService);
  }

  ngOnInit(): void {
    const repos = this.sharedService.getRepositoriesOfUser();
    console.log('Repositories from sharedService:', repos);
    if (repos && repos.length) {
      this.repositories = repos;
      this.loadRequestsForRepos();
    } else {
      // subscribe to observable if not yet available
      this.loading = true;
      this.repositoryService.getRepositoriesSnippetsOfUser()
        .subscribe(
          repos => {
            this.repositories = repos;
            this.loading = false;
            this.loadRequestsForRepos();
          },
          (err) => {
            console.error('Error loading repositories of user:', err);
            this.loading = false;
          });
    }
  }

  protected getRequests(params: any): Observable<Paging<Request>> {
    return this.requestsService.getAllRequests(params);
  }

  handleDecision(event: { request: Request; decision: Decision; comment?: string }) {
    const {request, decision, comment} = event;
    // this.updateDecision(request.id, decision, Authority.DATASOURCE_ADMIN, comment);
    this.requestsService.createRequestDecision(request.id, decision, Authority.DATASOURCE_ADMIN, comment || '').subscribe({
      next: () => {
        this.loadRequestsForRepos();
      },
      error: err => {
        console.error('Error updating request decision:', err);
      }
    });
  }

  loadRequestsForRepos() {
    let ids = this.repositories.map(repo => repo.id);
    ids.forEach(id => {
      this.getRequests({datasourceIds: id, size: 100}).subscribe(
        next => {

          this.requestsMap.set(id, next.results);
          if (next.results.length > 0) {
            this.foundRequest = true;
          }
          console.log(this.requestsMap);
        }
      );
    });
  }

}
