import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
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

    @ViewChild('decisionModal') decisionModalRef!: ElementRef;

    @Output() confirmDecision = new EventEmitter<{request: Request, decision: 'APPROVED' | 'REJECTED'; comment?: string}>();

    // modal state
    modalRequest: Request | null = null;
    modalDecision: 'APPROVED' | 'REJECTED' | null = null;
    modalComment: string = '';

    openDecisionModal(request: Request, decision: 'APPROVED' | 'REJECTED') {
        console.log('Opening modal for', request.id, 'with decision', decision);
        this.modalRequest = request;
        this.modalDecision = decision;
        this.modalComment = '';

        setTimeout(() => {
        if (typeof UIkit !== 'undefined' && this.decisionModalRef?.nativeElement) {
            UIkit.modal(this.decisionModalRef.nativeElement).show();
        }
     });
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
        if (typeof UIkit !== 'undefined' && this.decisionModalRef?.nativeElement) {
            UIkit.modal(this.decisionModalRef.nativeElement).hide();
        }
        this.modalRequest = null;
        this.modalDecision = null;
        this.modalComment = '';
    }

    ngOnDestroy(): void {
  // close any active UIKit modals when the component is destroyed
  if (typeof UIkit !== 'undefined') {
    // Select all open modals created by UIKit( both .uk-modal and .uk-modal-container types)
    const active = document.querySelectorAll('.uk-modal.uk-open, .uk-modal-container.uk-open');
    // Loop through each open modal and hide it using the UIKit API
    active.forEach(modal => {
      try {
        UIkit.modal(modal).hide();
      } catch (err) {}
    });
  }

  // Remove any leftover modal elements that UIKit may have moved into the <body>
  const leftovers = document.querySelectorAll('body > .uk-modal-container');
  // Loop through all UIKit modal containers found in the body
  leftovers.forEach(modal => {
    // Only remove the specific modal related to this component (by ID)
      modal.remove();
    
  });
}

}

