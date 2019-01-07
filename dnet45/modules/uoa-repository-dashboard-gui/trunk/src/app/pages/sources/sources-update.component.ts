import { Component, OnInit } from '@angular/core';

@Component ({
  selector: 'app-sources-update',
  templateUrl: 'sources-update.component.html'
})

export class SourcesUpdateComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  downloadLogo() {
    window.open('../../../assets/imgs/OpenAIRE_validated_icon_medium.png', '_blank', 'enabledstatus=0,toolbar=0,menubar=0,location=0');
  }
}
