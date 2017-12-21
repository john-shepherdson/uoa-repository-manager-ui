/**
 * Created by myrto on 11/24/17.
 */

import {Component, OnInit} from '@angular/core';
import {PiwikInfo} from '../../domain/typeScriptClasses';
import {RepositoryService} from '../../services/repository.service';
import {ActivatedRoute} from '@angular/router';

@Component ({
  selector: 'app-metrics-instructions',
  templateUrl: 'metrics-instructions.component.html'
})

export class MetricsInstructionsComponent implements OnInit {
  piwik: PiwikInfo;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getPiwik();
  }

  getPiwik(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.repoService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => {
        console.log(error);
        this.errorMessage = 'An error occured! The information about the site could not be retrieved';
      }
    );
  }

}
