import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { didntChooseBaseUrl, invalidCustomBaseUrl } from '../../../domain/shared-messages';
import { ValidatorService } from '../../../services/validator.service';

@Component({
  selector: 'compatibility-validate-step1',
  templateUrl: 'compatibility-validate-step1.component.html'
})

export class CompatibilityValidateStep1Component implements OnInit {
  group: FormGroup;
  errorMessage: string;

  @Input() baseUrlList: string[];

  @Output() emitObject: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.group = this.fb.group({
      selectBaseUrl : '',
      customBaseUrl : ''
    });
    this.group.get('customBaseUrl').disable();
  }

  chooseUrl(choice: boolean){
    if (choice) {
      this.group.get('selectBaseUrl').enable();
      this.group.get('customBaseUrl').disable();
    } else {
      this.group.get('selectBaseUrl').disable();
      this.group.get('customBaseUrl').enable();
    }
  }

  submitForm() {
    if (this.group.get('selectBaseUrl').enabled){
      if ( this.group.get('selectBaseUrl').value) {
        this.emitObject.emit(this.group.get('selectBaseUrl').value);
        console.log(`selected baseUrl!`);
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = didntChooseBaseUrl;
        return false;
      }
    } else if (this.group.get('customBaseUrl').enabled) {
      if ( this.group.get('customBaseUrl').value ) {
        this.emitObject.emit(this.group.get('customBaseUrl').value);
        console.log('added new baseUrl!');
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = didntChooseBaseUrl;
        return false;
      }
    }
  }
}
