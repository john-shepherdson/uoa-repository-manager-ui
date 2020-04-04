import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sources-register',
  templateUrl: 'sources-register.component.html'
})

export class SourcesRegisterComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  // fixme still when I click the link inside the text in overlay, this event happens as well (I go to the first step of the wizard)
  goTo(datasourceType: string) {
    if(datasourceType==='literature') {
      this.router.navigateByUrl(`/sources/register/${datasourceType}?step=selectDatasource`);
    } else if(datasourceType==='data') {
      this.router.navigateByUrl(`/sources/register/${datasourceType}?step=selectDatasource`);
    } else if(datasourceType==='journal') {
      this.router.navigateByUrl(`/sources/register/${datasourceType}?step=basicInformation`);
    } else if(datasourceType==='aggregator') {
      this.router.navigateByUrl(`/sources/register/${datasourceType}?step=basicInformation`);
    }
  }
}
