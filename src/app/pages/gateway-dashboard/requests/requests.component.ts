import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RequestsService } from "../services/request.service";
import { CommunityContextService } from "src/app/services/communityContext.service";
import { AdminPgRouting } from "../../adminPg/adminPg.routing";
import { Router } from "@angular/router";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Params } from '@angular/router';
import { InputComponent, Option } from '../../../shared/input.component';
import { ActivatedRoute } from "@angular/router";
import { Paging } from "src/app/domain/paging";





@Component({
  selector: 'gateway-requests',
  standalone: true,
  templateUrl: './requests.component.html',
  imports: [CommonModule, AdminPgRouting, MatPaginatorModule, ReactiveFormsModule, InputComponent]
})

export class RequestsComponent implements OnInit {
  requests: Paging<Request>;
  communityId?: string;
  showActionsColumn: boolean = false;
  qParams: Params = {};
  loading: boolean = false;
  
  errorMessage: string | null = null;
  loadingMessage: string | null = null;

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
    {value: 'CANCELLED', label: 'Cancelled'},
    {value: 'EXPIRED', label: 'Expired'},
    {value: 'null', label: 'Reset'}
  ];



  constructor(private requestsService: RequestsService, private communityService: CommunityContextService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {

    const currentUrl = this.router.url;
    this.showActionsColumn = currentUrl.includes('/requests/actions');

    this.route.queryParams.subscribe(params => {
      this.qParams = {...params};

      Object.keys(params).forEach(key => {
        this.filterForm.get(key)?.setValue(params[key]);
      });

       // 2) optionally push defaults into the URL if absent:
      if (!params['page'] || !params['size']) {
        this.qParams['page'] = this.filterForm.get('page').value;
        this.qParams['size'] = this.filterForm.get('size').value;
        this.updateWithNavigation();
        return;  // prevents the search below from running on renavigation
      }

      this.loadingMessage = 'Loading requests...';
      this.requestsService.getRequests(params).pipe().subscribe({
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
    // console.log(event);
    this.qParams['page'] = event.pageIndex;
    this.qParams['size'] = event.pageSize;
    this.updateWithNavigation();
  }

  updateWithNavigation() {
    this.router.navigate([], {relativeTo: this.route, queryParams: this.qParams}).then();
  }


}
  

