import {Directive, OnInit} from '@angular/core';
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
import {PageEvent} from '@angular/material/paginator';
import {ReusableTableComponent} from 'src/app/shared/reusable-table/reusable-table.component';
import {CommunityContextService} from 'src/app/services/communityContext.service';

@Directive({
  selector: 'base-gateway-request',
  standalone: true,
  providers: [ReusableTableComponent]
})

export abstract class BaseGatewayRequestsComponent implements OnInit {
  requests: Paging<Request>;
  private sub?: Subscription;
  showActionsColumn: boolean = false;
  qParams: Params = {};
  loading: boolean = false;
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

  protected abstract getRequests(params: any): Observable<Paging<Request>>;

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
      console.log('Current community ID:', id);
      this.communityId = id;
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

  // approveRequest(requestId: number) {
  //   this.requestsService.updateRequest(requestId, 'APPROVED', 'TARGET_GATEWAY_ADMIN', 'Approved by admin')
  //     .subscribe({
  //       next: () => {
  //         // reload current list
  //         this.getRequests(this.qParams).subscribe({
  //           next: data => this.requests = data,
  //           error: err => console.error('Error reloading requests after approve:', err)
  //         });
  //       },
  //       error: err => console.error('Error approving request:', err)
  //     });
  // }

//   approveRequest(request: Request) {
//     console.log('Before approve: ', request);
//      {{this.communityId}}
//     if (!this.communityId) {
//       console.error('Community ID is not set');
//   }

//   let authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN';
//   if (request.sourceGateway.id === this.communityId) {
//       authority = 'SOURCE_GATEWAY_ADMIN';
//   } else if (request.targetGateway.id === this.communityId) {
//       authority = 'TARGET_GATEWAY_ADMIN';
//   } else {
//       console.error('Current community is neither source nor target for this request');
//       return;
//   }
//     console.log('Authority chosen: ', authority);
//     this.requestsService.updateRequest(request.id, 'APPROVED', authority, 'Approved by admin')
//       .subscribe({
//         next: action => {
//           this.getRequests(this.qParams).subscribe({
//           next: (data) => {
//             this.requests = data;
//             this.loadingMessage = null;
//           },
//           error: (err) => {
//             console.error('Error fetching requests:', err);
//             this.loadingMessage = null;
//             this.errorMessage = 'Error fetching requests';
//           }
//         });
//         },
//         error: err => console.error('Error approving request:', err)
//       });
// }

  // rejectRequest(requestId: number) {
  //   this.requestsService.updateRequest(requestId, 'REJECTED', 'TARGET_GATEWAY_ADMIN', 'Rejected by admin')
  //     .subscribe({
  //       next: () => {
  //         // reload current list
  //         this.getRequests(this.qParams).subscribe({
  //           next: data => this.requests = data,
  //           error: err => console.error('Error reloading requests after reject:', err)
  //         });
  //       },
  //       error: err => console.error('Error rejecting request:', err)
  //     });
  // }

//   rejectRequest(request: Request) {
//     if (!this.communityId) {
//       console.error('Community ID is not set');
//       return;
//   }
//   let authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN';
//   if (request.sourceGateway.id === this.communityId) {
//       authority = 'SOURCE_GATEWAY_ADMIN';
//   } else if (request.targetGateway.id === this.communityId) {
//       authority = 'TARGET_GATEWAY_ADMIN';
//   } else {
//       console.error('Current community is neither source nor target for this request');
//       return;
//   }
//     this.requestsService.updateRequest(request.id, 'REJECTED', authority, 'Rejected by admin')
//       .subscribe({
//         next: updateRequest => {
//           this.getRequests(this.qParams).subscribe({
//           next: (data) => {
//             this.requests = data;
//             this.loadingMessage = null;
//         },
//           error: (err) => {
//             console.error('Error fetching requests:', err);
//             this.loadingMessage = null;
//             this.errorMessage = 'Error fetching requests';
//           }
//         });
//         },
//         error: err => console.error('Error rejecting request:', err)
//       });
// }

  handleDecision(event: { request: Request, decision: 'APPROVED' | 'REJECTED'; comment?: string }) {
    const {request, decision, comment} = event;

    if (!this.communityId) {
      console.error('Community ID is not set');
      this.loadingMessage = null;
      this.errorMessage = 'Community ID is not found';
      return;
    }
    let authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN';
    if (request.sourceGateway.id === this.communityId) {
      authority = 'SOURCE_GATEWAY_ADMIN';
    } else if (request.targetGateway.id === this.communityId) {
      authority = 'TARGET_GATEWAY_ADMIN';
    } else {
      console.error('Current community is neither source nor target for this request');
      this.loadingMessage = null;
      this.errorMessage = 'Current community is neither source nor target for this request';
      return;
    }
    this.updateDecision(request.id, decision, authority, comment);
  }

  protected updateDecision(id: number, decision: 'APPROVED' | 'REJECTED', authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN', comment: string) {
    this.requestsService.updateRequest(id, decision, authority, comment || '')
      .subscribe({
        next: () => {
          this.getRequests(this.qParams).subscribe({
            next: (data) => {
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
      });
  }

}

