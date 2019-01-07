import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'app-admin-help-texts',
  templateUrl: 'adminPg-help-texts.component.html'
})

export class AdminPgHelpTextsComponent implements OnInit {
  helpTextContent: string = "";
  previewContent: string = "";
  constructor() {}



  ngOnInit() {}

  showPreview() {
    this.previewContent = this.helpTextContent;
  }


}
