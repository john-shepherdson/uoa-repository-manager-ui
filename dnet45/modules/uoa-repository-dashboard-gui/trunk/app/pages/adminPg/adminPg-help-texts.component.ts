import {Component, OnInit} from "@angular/core";

@Component ({
  selector: 'app-admin-help-texts',
  templateUrl: 'adminPg-help-texts.component.html'
})

export class AdminPgHelpTextsComponent implements OnInit {
  ckeditorContent: string = "";
  constructor() {}

  ngOnInit() {
    this.ckeditorContent = `<p>My HTML</p>`;
  }

  onChange(event : any) {
    console.log(this.ckeditorContent);
  }
}
