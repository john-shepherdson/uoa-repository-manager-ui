import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compatibility-validation-results',
  templateUrl: 'compatibility-validation-results.component.html'
})

export class CompatibilityValidationResultsComponent implements OnInit {
  jobId: string;

  constructor (private route: ActivatedRoute) {}

  ngOnInit () {}

  getId() {
    this.jobId = this.route.snapshot.paramMap.get('id');
  }
}
