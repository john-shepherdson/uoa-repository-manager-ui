import {Component} from '@angular/core';
import {RequestsService} from '../../gateway-dashboard/services/request.service';
import {SharedService} from 'src/app/services/shared.service';
import {RepositoryService} from 'src/app/services/repository.service';
import {Request} from '../../gateway-dashboard/domain/request.domain';
import {Paging} from 'src/app/domain/paging';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGatewayRequestsComponent} from './base-gateway-requests.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/shared/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReusableTableComponent } from 'src/app/shared/reusable-table/reusable-table.component';

@Component({
    selector: 'gateway-actions',
    templateUrl: '../../gateway-dashboard/requests/requests.component.html',
    standalone: true,
    imports: [
        CommonModule,
        InputComponent,
        ReactiveFormsModule,
        ReusableTableComponent
    ]
})

export class GatewayActionsComponent extends BaseGatewayRequestsComponent {
     constructor(
        protected requestsService: RequestsService,
        protected sharedService: SharedService,
        protected repositoryService: RepositoryService,
        protected router: Router,
        protected route: ActivatedRoute) {
        super(requestsService, sharedService, repositoryService, router, route);
      }

    protected getRequests(params: any): Observable<Paging<Request>> {
        return this.requestsService.getGatewayActions(params);
    }
}
