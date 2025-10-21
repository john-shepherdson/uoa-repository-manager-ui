import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Request } from "src/app/pages/gateway-dashboard/domain/request.domain";

declare const UIkit: any;

@Component({
    selector: 'app-reusable-table',
    templateUrl: './reusable-table.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ReusableTableComponent {
    @Input() data: Request[] = [];
    @Input() showActionsColumn: boolean = false;
    @Input() currentGatewayId: number | null = null;

    // @Output() approve = new EventEmitter<Request>();
    // @Output() reject = new EventEmitter<Request>();

    @Output() confirmDecision = new EventEmitter<{request: Request, decision: 'APPROVED' | 'REJECTED'; comment?: string}>();

    // modal state
    modalRequest: Request | null = null;
    modalDecision: 'APPROVED' | 'REJECTED' | null = null;
    modalComment: string = '';

    openDecisionModal(request: Request, decision: 'APPROVED' | 'REJECTED') {
        this.modalRequest = request;
        this.modalDecision = decision;
        this.modalComment = '';

        const modal = document.getElementById('decision-modal');
        if (modal && typeof UIkit !== 'undefined') {
            UIkit.modal(modal).show();
        } else {
            console.error('UIkit is not defined or modal element not found.');
        }
    }

    confirmModal() {
        if (this.modalRequest && this.modalDecision) {
            this.confirmDecision.emit({
                request: this.modalRequest,
                decision: this.modalDecision,
                comment: this.modalComment || undefined
            });
            this.closeModal();
        }
    }

    closeModal() {
        const modal = document.getElementById('decision-modal');
        if (modal && typeof UIkit !== 'undefined') {
            UIkit.modal(modal).hide();
        }
        this.modalRequest = null;
        this.modalDecision = null;
        this.modalComment = '';
    }
}

//     onApprove(request: Request) {
//         this.approve.emit(request);
//     }

//     onReject(request: Request) {
//         this.reject.emit(request);
//     }
// }
