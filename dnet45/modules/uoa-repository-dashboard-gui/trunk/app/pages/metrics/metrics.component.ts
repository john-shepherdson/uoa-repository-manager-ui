/**
 * Created by myrto on 11/27/17.
 */
import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-metrics',
  templateUrl: 'metrics.component.html'
})

export class MetricsComponent implements OnInit {
  title: string = '';

  constructor() {}

  ngOnInit() {
    this.title = 'Choose the Datasource for which you would like to view or enable metrics';
  }

}
