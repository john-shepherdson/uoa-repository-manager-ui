/**
 * Created by myrto on 11/24/17.
 */
import { Component, OnInit } from '@angular/core';
import { PiwikInfo, Repository } from '../../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { PiwikService } from '../../../services/piwik.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { SharedService } from "../../../services/shared.service";

@Component ({
  selector: 'app-metrics-instructions',
  templateUrl: 'metrics-instructions.component.html'
})

export class MetricsInstructionsComponent implements OnInit {

  piwik: PiwikInfo;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private piwikService: PiwikService,
    private authService: AuthenticationService,
    private sharedService: SharedService) {}

  ngOnInit() {

    if(this.sharedService.getRepository())
      this.piwik = this.sharedService.getRepository().piwikInfo;

    this.sharedService.repository$.subscribe(
      r => {
        this.piwik = r.piwikInfo;
      }
    );

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }
}
