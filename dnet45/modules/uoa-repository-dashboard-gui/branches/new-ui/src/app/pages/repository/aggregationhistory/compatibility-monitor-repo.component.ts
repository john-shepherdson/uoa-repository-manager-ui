import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregationDetails, Repository } from '../../../domain/typeScriptClasses';
import { RepositoryService } from '../../../services/repository.service';
import { loadingAggregationHistory, loadingAggregationHistoryError, noAggregationHistory } from '../../../domain/shared-messages';
import { SharedService } from "../../../services/shared.service";

@Component ({
  selector: 'app-compatibility-monitor-repo',
  templateUrl: 'compatibility-monitor-repo.component.html'
})

export class CompatibilityMonitorRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;
  noAggregations: string;

  repoName = '';
  repo: Repository;

  latestAggregations: AggregationDetails[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private sharedService: SharedService) {}

  ngOnInit() {

    if(this.sharedService.getRepository()) {
      this.repo = this.sharedService.getRepository();
      this.repoName = this.repo.officialName;
      this.getLatestAggregationHistory();
    }

    this.sharedService.repository$.subscribe(
      r => {
        this.repo = r;
        if (this.repo) {
          this.repoName = this.repo.officialName;
          this.getLatestAggregationHistory();
        }
      }
    );

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  getLatestAggregationHistory() {
    this.loadingMessage = loadingAggregationHistory;
    this.repoService.getRepositoryAggregations(this.repo.id).subscribe(
      aggr => this.latestAggregations = aggr,
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingAggregationHistoryError;
      },
      () => {
        this.loadingMessage = '';
        if ( !this.latestAggregations || (this.latestAggregations.length === 0) ) {
          this.noAggregations = noAggregationHistory;
        }
      }
    );
  }

}
