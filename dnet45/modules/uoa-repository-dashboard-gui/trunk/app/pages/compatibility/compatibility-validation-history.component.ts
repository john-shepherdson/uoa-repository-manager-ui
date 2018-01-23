import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-compatibility-validation-history',
  templateUrl: 'compatibility-validation-history.component.html'
})

export class CompatibilityValidationHistoryComponent  implements OnInit {
  jobTypes: string[];

  constructor() {}

  ngOnInit() {
    this.jobTypes = ["Compatibility Test","Registration Request","Workflow Request"];
  }
}
