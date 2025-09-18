import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RequestsService } from "../services/request.service";
import { CommunityContextService } from "src/app/services/communityContext.service";
import { AdminPgRouting } from "../../adminPg/adminPg.routing";
import { Router } from "@angular/router";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'gateway-requests',
  standalone: true,
  templateUrl: './requests.component.html',
  imports: [CommonModule, AdminPgRouting, MatPaginatorModule]
})

export class RequestsComponent implements OnInit {
  requests: Request[] = [];
  communityId?: string;
  showActionsColumn: boolean = false;

  //Pagination variables
  page  = 0;
  pageSize = 3;
  total = 0;
  loading = false;

  constructor(private requestsService: RequestsService, private communityService: CommunityContextService, private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.showActionsColumn = currentUrl.includes('/requests/actions');

    this.loadRequests(this.page);
    }

  loadRequests(page: number): void {
    this.loading = true;

    const queryParams = {
      page: page,
      size: this.pageSize,
      sort: 'status',
      order: 'ASC'
    };

    this.requestsService.getRequests(queryParams).subscribe({
      next: (data) => {
        this.requests = data.results;
        this.total = data.total;
        this.page = page;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching requests:', err);
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    this.loadRequests(newPage - 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  handlePaginationChanges(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRequests(this.page);
  }
}
  

