import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AggregationDetails, Repository} from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import {
  loadingAggregationHistory,
  loadingAggregationHistoryError,
  loadingRepoError,
  loadingRepoMessage,
  noAggregationHistory
} from '../../domain/shared-messages';

@Component ({
  selector: 'app-compatibility-fullHistory-monitor-repo',
  templateUrl: 'compatibility-monitor-fullHistory-repo.component.html'
})

export class CompatibilityMonitorFullHistoryRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;
  noAggregations: string;

  repoId: string = '';
  repoName: string = '';
  repo: Repository;

  aggregationsMap: Map<string,AggregationDetails[]> = new Map<string,AggregationDetails[]>();
  years: string[] = [];

  constructor(private route: ActivatedRoute,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.readRepoId();
    this.getRepo();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.repoName = `repository with id \'${this.repoId}\'`;
  }

  getRepo(){
    if (this.repoId) {
      this.loadingMessage = loadingRepoMessage;
      this.repoService.getRepositoryById(this.repoId).subscribe(
        repo => {
          this.repo = repo;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        },
        () => {
          this.loadingMessage = '';
          if (this.repo) {
            this.repoName = this.repo.officialName;
            this.getAllAggregationHistory();
          } else {
            this.errorMessage = loadingRepoError;
          }
        }
      );
    }
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
        for (let key in this.aggregationsMap) {
          this.years.push(key);
        }
        if ( this.years.length === 0 ) {
          this.noAggregations = noAggregationHistory;
        }
      }
    );
  }

}
