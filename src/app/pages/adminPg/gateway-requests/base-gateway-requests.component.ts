import {Component, Directive, OnInit} from '@angular/core';
import {RequestsService} from '../../gateway-dashboard/services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Request} from '../../gateway-dashboard/domain/request.domain';
import {FormControl, FormGroup} from '@angular/forms';
import {Option} from '../../../shared/input.component';
import {Paging} from 'src/app/domain/paging';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Directive({
  selector: 'base-gateway-request',
  standalone: true,
})

export abstract class BaseGatewayRequestsComponent implements OnInit {
  requests: Paging<Request>;
  private sub?: Subscription;
  showActionsColumn: boolean = false;
  qParams: Params = {};
  loading: boolean = false;
  errorMessage: string | null = null;
  loadingMessage: string | null = null;

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
    protected route: ActivatedRoute) {
  }

  protected abstract getRequests(params: any): Observable<Paging<Request>>;

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.showActionsColumn = currentUrl.includes('/requests/actions');
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
}
