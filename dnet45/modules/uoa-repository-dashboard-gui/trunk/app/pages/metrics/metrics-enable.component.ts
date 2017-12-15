import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog.component';

@Component ({
  selector: 'metrics-enable',
  templateUrl: 'metrics-enable.component.html'
})

export class MetricsEnableComponent implements OnInit {
  modalTitle = "Confirmation";
  modalButton = "Yes, enable it";
  isModalShown: boolean;

  @ViewChild('confirmEnablingModal')
  public confirmEnablingModal : ConfirmationDialogComponent;


  constructor() {}

  ngOnInit() {
    this.isModalShown = false;
  }

  confirmEnabling() {
    this.confirmEnablingModal.showModal();
  }

  confirmedEnabling(){
    console.log('enabled repo');

  }
}
