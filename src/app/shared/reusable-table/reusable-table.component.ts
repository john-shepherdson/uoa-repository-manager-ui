import {CommonModule} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Decision, Request} from 'src/app/pages/gateway-dashboard/domain/request.domain';

declare const UIkit: any;

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReusableTableComponent {
  @Input() data: Request[] = [];
  @ViewChild('decisionModal') decisionModalRef!: ElementRef;
  @Output() confirmDecision = new EventEmitter<{ request: Request, decision: Decision; comment?: string }>();
  @Input({required: true}) showActionsColumn: () => boolean;
  @Input({required: true}) canPerformActions: (request: Request) => boolean;
  // modal state
  modalRequest: Request | null = null;
  modalDecision: Decision | null = null;
  modalComment: string = '';

  openDecisionModal(request: Request, decision: Decision) {
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
        } catch (err) {
        }
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

  protected readonly Decision = Decision;
}

