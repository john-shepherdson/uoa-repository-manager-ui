import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component ({
  selector: 'compatibility-validate-step3',
  templateUrl: 'compatibility-validate-step3.component.html'
})

export class CompatibilityValidateStep3Component implements OnInit {
  errorMessage: string;

  @Input() valSets: string[];

  group: FormGroup;
  currentNoOfRecords: string;

  constructor (private fb: FormBuilder) {}

  ngOnInit () {
    this.group = this.fb.group({
      noOfRecordsInput : '',
      selectValSet : '',
      xpathInput : ''
    });
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
}
