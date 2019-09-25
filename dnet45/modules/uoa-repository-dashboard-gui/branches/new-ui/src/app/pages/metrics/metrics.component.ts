/**
 * Created by myrto on 11/27/17.
 */
import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-metrics',
  templateUrl: 'metrics.component.html'
})

export class MetricsComponent implements OnInit {

  tilesView: boolean = true;

  constructor() {}

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("top_bar_active");   //add the class
    body.classList.remove("page_heading_active");
  }

  changeView(view: string) {
    this.tilesView = (view == 'tiles');
  }
}
