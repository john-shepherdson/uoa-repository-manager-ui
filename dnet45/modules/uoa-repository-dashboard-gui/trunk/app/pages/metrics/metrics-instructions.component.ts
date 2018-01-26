/**
 * Created by myrto on 11/24/17.
 */

import {Component, OnInit} from '@angular/core';
import {PiwikInfo} from '../../domain/typeScriptClasses';
import {ActivatedRoute} from '@angular/router';
import { PiwikService } from '../../services/piwik.service';

@Component ({
  selector: 'app-metrics-instructions',
  templateUrl: 'metrics-instructions.component.html'
})

export class MetricsInstructionsComponent implements OnInit {
  piwik: PiwikInfo;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private piwikService: PiwikService
  ) {}

  ngOnInit() {
    this.getPiwik();
  }

  getPiwik(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.piwikService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => console.log(error)
    );
  }

}
