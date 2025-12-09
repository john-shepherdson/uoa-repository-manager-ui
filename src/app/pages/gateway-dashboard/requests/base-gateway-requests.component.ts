import {Directive, OnInit} from '@angular/core';
import {RequestsService} from '../services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Authority, Decision, Request, RequestType} from '../domain/request.domain';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputComponent, Option} from '../../../shared/input.component';
import {Paging} from 'src/app/domain/paging';
import {combineLatest, Observable, PartialObserver, Subscription} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {ReusableTableComponent} from 'src/app/shared/reusable-table/reusable-table.component';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {CommonModule} from '@angular/common';
import {environment} from '../../../../environments/environment';

export const BASE_IMPORTS = [
  CommonModule,
  InputComponent,
  ReactiveFormsModule,
  ReusableTableComponent,
  MatPaginatorModule
] as const;

@Directive()
export abstract class BaseGatewayRequestsComponent implements OnInit {
  protected readonly RequestType = RequestType;

  requests: Paging<Request>;
  private sub?: Subscription;
  qParams: Params = {};
  loading = false;
  errorMessage: string | null = null;
  loadingMessage: string | null = null;
  communityId: string | null = null;

  // keyword: FormControl = new FormControl(null);
  filterForm: FormGroup = new FormGroup({
    sort: new FormControl<string | null>(null),
    order: new FormControl<string | null>(null),
    page: new FormControl<number>(0),
    size: new FormControl<number>(5),
    keyword: new FormControl<string | null>(null),
    requestType: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null)
    // from: '0'
  });

  statusOptions: Option[] = [
    {value: 'PENDING', label: 'Pending'},
    {value: 'APPROVED', label: 'Approved'},
    {value: 'REJECTED', label: 'Rejected'},
    {value: 'CANCELLED', label: 'Cancelled'}
  ];

  protected constructor(
    protected requestsService: RequestsService,
    protected sharedService: SharedService,
    protected repositoryService: RepositoryService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected communityService: CommunityContextService) {
  }

  protected readonly reloadRequests: PartialObserver<any> = {
    next: () => {
      this.getRequests(this.qParams).subscribe({
        next: (data) => {
          console.log(data);
          this.requests = data;
          this.loadingMessage = null;
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Error fetching requests:', err);
          this.loadingMessage = null;
          this.errorMessage = 'Error fetching requests';
        }
      });
    },
    error: err => {
      this.loadingMessage = null;
      this.errorMessage = `Error processing request: ${err.message || err}`;
      console.error('Error processing request:', err);
    }
  };

  protected abstract getRequests(params: any): Observable<Paging<Request>>;

  protected showActionsColumn(): boolean {
    return true;
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    // this.showActionsColumn = currentUrl.includes('/requests/actions');
    this.sub = combineLatest([
      // Load component route data[requestParams]
      this.route.data.pipe(map(data => (data['requestParams'] ?? {}))),
      // Load dynamic filters from URL ?status=PENDING&page=2
      this.route.queryParams.pipe(map(queryParams => {
        this.qParams = {...queryParams};
        Object.keys(queryParams).forEach(key => {
          this.filterForm.get(key)?.setValue(queryParams[key]);
        });

        // 2) optionally push defaults into the URL if absent:
        if (!queryParams['page'] || !queryParams['size']) {
          this.qParams['page'] = this.filterForm.get('page').value;
          this.qParams['size'] = this.filterForm.get('size').value;
          this.updateWithNavigation();
          return;  // prevents the search below from running on renavigation
        }

        this.loadingMessage = 'Loading requests...';
        return queryParams;
      }))
    ])
      .pipe(
        map(([defaults, query]) => ({...defaults, ...query})), // precedence: query > defaults
        distinctUntilChanged()
      )
      .subscribe(params => {
        this.getRequests(params).subscribe({
          next: (data) => {
            this.requests = data;
            this.loadingMessage = null;
          },
          error: (err) => {
            console.error('Error fetching requests:', err);
            this.loadingMessage = null;
            this.errorMessage = 'Error fetching requests';
          }
        });
      });

    this.communityService.getCurrentCommunityId().subscribe(id => {
      this.communityId = id ? id : environment.OPENAIRE_ID;
      console.debug('Current community ID:', this.communityId);
    });
  }

  handleFilterChanges(path: string) {
    const value = this.filterForm.get(path)?.value;

    if (value === 'null' || value === '') {
      delete this.qParams[path];
    } else {
      this.qParams[path] = value;
    }

    this.qParams['page'] = 0;
    this.filterForm.get('page')?.setValue(0);
    this.updateWithNavigation();
  }

  handlePaginationChanges(event: PageEvent) {
    console.log(event);
    this.qParams['page'] = event.pageIndex;
    this.qParams['size'] = event.pageSize;
    this.updateWithNavigation();
  }

  updateWithNavigation() {
    this.router.navigate([], {relativeTo: this.route, queryParams: this.qParams}).then();
  }

  handleDecision(event: { request: Request; decision: Decision; comment?: string }) {
    const {request, decision, comment} = event;
    console.log(this.communityId);
    if (!this.communityId) {
      console.error('Community ID is not set');
      this.loadingMessage = null;
      this.errorMessage = 'Community ID is not found';
      return;
    }
    let authority: Authority;
    if (request.sourceGateway.id === this.communityId) {
      authority = Authority.SOURCE_GATEWAY_ADMIN;
    } else if (request.targetGateway.id === this.communityId) {
      authority = Authority.TARGET_GATEWAY_ADMIN;
    } else {
      console.error('Current community is neither source nor target for this request');
      this.loadingMessage = null;
      this.errorMessage = 'Current community is neither source nor target for this request';
      return;
    }
    this.updateDecision(request.id, decision, authority, comment);
  }

  protected updateDecision(id: number, decision: Decision, authority: Authority, comment: string) {
    this.requestsService.createRequestDecision(id, decision, authority, comment || '')
      .subscribe(this.reloadRequests);
  }

  protected abstract checkIfActionsAllowed(request: Request): boolean;

}

