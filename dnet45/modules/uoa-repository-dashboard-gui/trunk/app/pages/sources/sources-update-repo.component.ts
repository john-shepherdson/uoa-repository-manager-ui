import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {
  interfaceForm: boolean;

  constructor() {}

  ngOnInit() {
    this.interfaceForm = false;
  }

  showInterfaceFormToggle(){
    if(this.interfaceForm) {
      this.interfaceForm = false;
    } else {
      this.interfaceForm = true;
    }
  }
}
