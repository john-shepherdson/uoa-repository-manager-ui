import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'app-sources-update',
  templateUrl: 'sources-update.component.html'
})

export class SourcesUpdateComponent implements OnInit {
  parent_id: string;

  constructor() {}

  ngOnInit() {
    this.parent_id = 'sourcesUpdate';
  }
}
