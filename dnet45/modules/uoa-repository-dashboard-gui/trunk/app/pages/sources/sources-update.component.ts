import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'app-sources-update',
  templateUrl: 'sources-update.component.html'
})

export class SourcesUpdateComponent implements OnInit {
  title: string = '';

  constructor() {}

  ngOnInit() {
    this.title = 'Choose the Datasource you would like to manage';
  }
}
