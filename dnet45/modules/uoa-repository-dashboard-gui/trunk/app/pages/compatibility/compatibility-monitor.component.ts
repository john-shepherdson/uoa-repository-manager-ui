import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'app-compatibility-monitor',
  templateUrl: 'compatibility-monitor.component.html'
})

export class CompatibilityMonitorComponent implements OnInit {
  jobTypes: string[];

  constructor() {}

  ngOnInit() {
    this.jobTypes = ["Compatibility Test","Registration Request","Workflow Request"];
  }
}
