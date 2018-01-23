import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component ({
  selector: 'compatibility-validate-literature',
  templateUrl: 'compatibility-validate-type.component.html'
})

export class CompatibilityValidateTypeComponent implements OnInit {
  type: string = '';
  showDatasource: boolean;
  showGuidelines: boolean;
  showParameters: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.readType();
    this.showDatasource = true;
  }

  readType() {
    this.type = this.route.snapshot.paramMap.get('type');
    console.log(this.type);
  }

  moveAStep(){
    if (this.showDatasource) {
      this.showGuidelines = true;
      this.showDatasource = false;
      this.step2 = 'active';
    } else if (this.showGuidelines) {
      this.showParameters = true;
      this.showGuidelines = false;
      this.step3 = 'active';
    } else if (this.showParameters) {
      this.showFinish = true;
      this.showParameters = false;
      this.step4 = 'active';
    }
  }

  moveBackAStep(){
    if (this.showGuidelines) {
      this.showDatasource = true;
      this.showGuidelines = false;
      this.step2 = '';
    } else if (this.showParameters) {
      this.step3 = '';
      this.showGuidelines = true;
      this.showParameters = false;
    } else if (this.showFinish) {
      this.showParameters = true;
      this.showFinish = false;
      this.step4 = '';
    }
  }

}
