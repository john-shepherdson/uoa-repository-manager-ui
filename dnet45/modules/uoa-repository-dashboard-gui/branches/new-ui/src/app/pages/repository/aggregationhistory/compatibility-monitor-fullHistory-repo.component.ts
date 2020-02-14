import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregationDetails, Repository } from '../../../domain/typeScriptClasses';
import { RepositoryService } from '../../../services/repository.service';
import { loadingAggregationHistory, loadingAggregationHistoryError, noAggregationHistory } from '../../../domain/shared-messages';
import { SharedService } from "../../../services/shared.service";

@Component ({
  selector: 'app-compatibility-fullhistory-monitor-repo',
  templateUrl: 'compatibility-monitor-fullHistory-repo.component.html'
})

export class CompatibilityMonitorFullHistoryRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;
  noAggregations: string;

  repoName = '';
  repo: Repository;

  aggregationsMap: Map<string, AggregationDetails[]> = new Map<string, AggregationDetails[]>();
  years: string[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private sharedService: SharedService) {}

  ngOnInit() {

    if(this.sharedService.getRepository()) {
      this.repo = this.sharedService.getRepository();
      this.repoName = this.repo.officialName;
      this.getAllAggregationHistory();
    }

    this.sharedService.repository$.subscribe(
      r => {
        this.repo = r;
        if (this.repo) {
          this.repoName = this.repo.officialName;
          this.getAllAggregationHistory();
        }
      }
    );

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  getAllAggregationHistory() {
    this.loadingMessage = loadingAggregationHistory;
    this.repoService.getRepositoryAggregationsByYear(this.repo.id).subscribe(
      aggr => this.aggregationsMap = aggr,
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingAggregationHistoryError;
      },
      () => {
        this.loadingMessage = '';
        this.years = Object.keys(this.aggregationsMap);
        if ( this.years.length === 0 ) {
          this.noAggregations = noAggregationHistory;
        } else {
          this.years.sort( (a, b)  => ( a > b ? -1 : 1 ) );
        }
      }
    );
  }

}
