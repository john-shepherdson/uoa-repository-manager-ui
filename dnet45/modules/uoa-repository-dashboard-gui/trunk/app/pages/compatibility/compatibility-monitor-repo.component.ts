import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aggregations, Repository } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import {
  loadingAggregationHistory,
  loadingAggregationHistoryError,
  loadingRepoError,
  loadingRepoMessage,
  noAggregationHistory
} from '../../domain/shared-messages';

@Component ({
  selector: 'app-compatibility-monitor-repo',
  templateUrl: 'compatibility-monitor-repo.component.html'
})

export class CompatibilityMonitorRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;
  noAggregations: string;

  repoId: string = '';
  repoName: string = '';
  repo: Repository;

  aggregations: Aggregations;

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
            this.getAggregationHistory();
          } else {
            this.errorMessage = loadingRepoError;
          }
        }
      );
    }
  }

  getAggregationHistory() {
    this.loadingMessage = loadingAggregationHistory;
    this.repoService.getRepositoryAggregations(this.repo.id).subscribe(
      aggr => this.aggregations = aggr,
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingAggregationHistoryError;
      },
      () => {
        this.loadingMessage = '';
        if (this.aggregations && (!this.aggregations.aggregationHistory || !this.aggregations.aggregationHistory.length) ) {
          this.noAggregations = noAggregationHistory;
        }
      }
    );
  }
}
