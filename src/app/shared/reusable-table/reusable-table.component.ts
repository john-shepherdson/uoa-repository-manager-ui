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

    @Output() approve = new EventEmitter<number>();
    @Output() reject = new EventEmitter<number>();

    onApprove(id: number) {
        this.approve.emit(id);
    }

    onReject(id: number) {
        this.reject.emit(id);
    }
}