import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component ({
  selector: 'compatibility-validate-step3',
  templateUrl: 'compatibility-validate-step3.component.html'
})

export class CompatibilityValidateStep3Component implements OnInit {
  errorMessage: string;
  currentNoOfRecords: number;

  @Input() valSets: string[];
  @Output() emmitObject: EventEmitter<any> = new EventEmitter();

  group: FormGroup;

  constructor (private fb: FormBuilder) {}

  ngOnInit () {
    this.group = this.fb.group({
      noOfRecordsInput : '',
      selectValSet : '',
      xpathInput : ''
    });
    this.currentNoOfRecords = 10;
    this.group.get('noOfRecordsInput').disable();
    this.group.get('xpathInput').disable();

  }

  chooseAll(all: boolean) {
    if (all) {
      this.group.get('noOfRecordsInput').disable();
    } else {
      this.group.get('noOfRecordsInput').enable();
    }
  }

  addXpath(xpath: boolean) {
    if (xpath) {
      this.group.get('xpathInput').enable();
    } else {
      this.group.get('xpathInput').disable();
    }
  }

  submitChanges(){
    if (this.group.valid) {
      let valset: string;
      let emitted: string [];
      if ( this.group.get('noOfRecordsInput').enabled ) {
        emitted.push(this.group.get('noOfRecordsInput').value);
      } else {
        emitted.push('0')
      }
      if ( this.group.get('xpathInput').enabled ) {
        emitted.push(this.group.get('xpathInput').value);
      } else {
        emitted.push('');
      }
    }
  }
}
