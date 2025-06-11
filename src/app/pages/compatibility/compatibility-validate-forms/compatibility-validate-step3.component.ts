import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formErrorRequiredFields } from '../../../domain/shared-messages';
import {Option} from '../../../shared/input.component';

@Component ({
  selector: 'compatibility-validate-step3',
  templateUrl: 'compatibility-validate-step3.component.html'
})

export class CompatibilityValidateStep3Component implements OnInit {
  errorMessage: string;

  @Input() valSets: string[];
  @Output() emitObject: EventEmitter<any> = new EventEmitter();

  group: UntypedFormGroup;
  valSetsOptions: Option[] = [];

  constructor (private fb: UntypedFormBuilder) {}

  ngOnInit () {
    this.group = this.fb.group({
      noOfRecordsInput : '',
      selectValSet : [''],
      xpathInput : ''
    });
    this.group.get('noOfRecordsInput').setValue(10);
    this.group.get('noOfRecordsInput').disable();
    this.group.get('xpathInput').disable();

    this.valSetsOptions = [];
    this.valSetsOptions.push(
      {value: '', label: 'All sets'}
    );
    this.valSets.forEach(set => {
      this.valSetsOptions.push(
        {value: set['spec'], label: (set['name'] + ' (' + set['spec'] + ')')}
      );
    });
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

  submitChanges() {
    if (this.group.valid) {
      this.errorMessage = '';
      const emitted: string [] = [];

      if ( this.group.get('selectValSet').value) {
        emitted.push(this.group.get('selectValSet').value);
      } else {
        emitted.push('none');
      }

      if ( this.group.get('noOfRecordsInput').enabled ) {
        emitted.push(this.group.get('noOfRecordsInput').value);
      } else {
        emitted.push('-1');
      }

      if ( this.group.get('xpathInput').enabled ) {
        emitted.push(this.group.get('xpathInput').value);
      } else {
        emitted.push('');
      }
      this.emitObject.emit(emitted);

    } else {
      this.errorMessage = formErrorRequiredFields;
    }
  }
}
