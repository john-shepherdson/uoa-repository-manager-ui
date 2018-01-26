import { Component, Input, OnInit } from '@angular/core';
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

  chosenUrl: string;

  @Input() type: string;
  @Input() baseUrlList: string[];

  constructor(private fb: FormBuilder,
              private valService: ValidatorService) {}

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
    if ( this.group.get('selectBaseUrl').value || this.group.get('customBaseUrl').value ) {
      let response: boolean;
      if (this.group.get('customBaseUrl').value ) {
        this.valService.identifyRepository(this.group.get('customBaseUrl').value).subscribe(
          res => response = res,
          error => console.log(error)
        );
        if ( response ) {
          this.chosenUrl = this.group.get('customBaseUrl').value;
          console.log('added new baseUrl!');
          return true;
        } else {
          if (this.group.get('selectBaseUrl').value) {
            this.chosenUrl = this.group.get('selectBaseUrl').value;
            return true;
          } else {
            this.errorMessage = invalidCustomBaseUrl;
          }
        }
      } else {
        this.chosenUrl = this.group.get('selectBaseUrl').value;
        console.log('selected baseUrl!');
        return true;
      }
    } else {
      console.log('something went wrong');
      this.errorMessage = didntChooseBaseUrl;
    }
    return false;
  }
}
