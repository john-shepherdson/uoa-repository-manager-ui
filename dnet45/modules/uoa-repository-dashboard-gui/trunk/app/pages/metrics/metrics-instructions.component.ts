/**
 * Created by myrto on 11/24/17.
 */

import {Component, Input, OnInit} from '@angular/core';
import {PiwikInfo} from '../../domain/typeScriptClasses';
import {RepositoryService} from '../../services/repository.service';
import {ActivatedRoute} from '@angular/router';

@Component ({
  selector: 'app-metrics-instructions',
  templateUrl: 'metrics-instructions.component.html'
})

export class MetricsInstructionsComponent implements OnInit {
  @Input() piwik: PiwikInfo;

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
      error => console.log(error)
    );
  }

}
