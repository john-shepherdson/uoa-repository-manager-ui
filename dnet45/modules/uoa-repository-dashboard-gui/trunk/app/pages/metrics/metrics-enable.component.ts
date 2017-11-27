import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog.component';

@Component ({
  selector: 'metrics-enable',
  templateUrl: 'metrics-enable.component.html'
})

export class MetricsEnableComponent implements OnInit {
  someid: string;

  @ViewChild('confirmEnablingModal')
  public confirmEnablingModal : ConfirmationDialogComponent;


  constructor() {}

  ngOnInit() {
    this.someid = 'someid';
  }

  confirmEnabling() {
    this.confirmEnablingModal.ids = [this.someid];
    this.confirmEnablingModal.showModal();
  }

  confirmedEnabling(ids: string[]){
    const id = ids[0];
    console.log('received ' + id);
  }
}
