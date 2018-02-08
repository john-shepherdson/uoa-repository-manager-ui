import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetricsInfo, PiwikInfo } from '../../domain/typeScriptClasses';
import { PiwikService } from '../../services/piwik.service';
import { RepositoryService } from '../../services/repository.service';
import { loadingMetrics, loadingMetricsError } from '../../domain/shared-messages';

@Component ({
  selector: 'metrics-show',
  templateUrl: 'metrics-show.component.html'
})

export class MetricsShowComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;

  piwik: PiwikInfo;
  repoMetrics: MetricsInfo;

  constructor(
    private route: ActivatedRoute,
    private piwikService: PiwikService,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getMetrics();
  }

  /* PROBABLY NOT NEEDED */
  getPiwik() {
    let id = this.route.snapshot.paramMap.get('id');

    this.loadingMessage = loadingMetrics;
    this.piwikService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingMetricsError;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
      }
    );
  }

  getMetrics() {
    let id = this.route.snapshot.paramMap.get('id');

    this.loadingMessage = loadingMetrics;
    this.repoService.getMetricsInfoForRepository(id).subscribe(
      metrics => {
        this.repoMetrics = metrics;
      },
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingMetricsError;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
      }
    );
  }

}
