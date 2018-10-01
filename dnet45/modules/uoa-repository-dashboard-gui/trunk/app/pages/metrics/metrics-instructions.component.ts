/**
 * Created by myrto on 11/24/17.
 */

import {Component, OnInit} from '@angular/core';
import {PiwikInfo} from '../../domain/typeScriptClasses';
import {ActivatedRoute, Router} from '@angular/router';
import { PiwikService } from '../../services/piwik.service';
import {AuthenticationService} from "../../services/authentication.service";

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
    private authService: AuthenticationService) {}

  ngOnInit() {
    this.getPiwik();
  }

  getPiwik(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.piwikService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => console.log(error),
      () => {
        if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.piwik.requestorEmail.trim()) ) {
          this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
        }
      }
    );
  }

}
