import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Request } from "src/app/pages/gateway-dashboard/domain/request.domain";


@Component({
    selector: 'app-reusable-table',
    templateUrl: './reusable-table.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class ReusableTableComponent {
    @Input() data: Request[] = [];
    @Input() showActionsColumn: boolean = false;
    @Input() currentGatewayId: string | null = null;

    @Output() approve = new EventEmitter<Request>();
    @Output() reject = new EventEmitter<Request>();

    onApprove(request: Request) {
        this.approve.emit(request);
    }

    onReject(request: Request) {
        this.reject.emit(request);
    }
}