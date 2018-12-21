/**
 * Created by stefania on 5/2/17.
 */
import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {

  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;

  @Input() public isModalShown:boolean = false;

  @Input() public confirmed:boolean = true;

  @Input() public title: string;

  @Input() public confirmActionButton: string;

  @Input() public hideModalButton:string = 'Cancel';

  @Output() emitObject: EventEmitter<any> = new EventEmitter();

  private _ids: string[] = [];

  public set ids(ids: string[]) {
    this._ids = ids;
  }

  public showModal():void {
    this.isModalShown = true;
  }

  public hideModal():void {
    this.autoShownModal.hide();
  }

  public onHidden():void {
    this.isModalShown = false;
  }

  public confirmedAction() {
    this.emitObject.emit(this._ids);
    if(this.confirmed) {
      this.hideModal();
    }
  }
}
