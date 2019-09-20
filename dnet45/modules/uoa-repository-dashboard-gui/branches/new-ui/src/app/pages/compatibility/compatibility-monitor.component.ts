import {Component, OnInit} from '@angular/core';

@Component ({
  selector: 'app-compatibility-monitor',
  templateUrl: 'compatibility-monitor.component.html'
})

export class CompatibilityMonitorComponent implements OnInit {

  tilesView: boolean = true;

  constructor() {}

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("top_bar_active");   //add the class
  }

  changeView(view: string) {
    this.tilesView = (view == 'tiles');
  }
}
