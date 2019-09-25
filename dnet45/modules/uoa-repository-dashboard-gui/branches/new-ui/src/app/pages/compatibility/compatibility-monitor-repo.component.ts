import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AggregationDetails, Repository} from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { loadingAggregationHistory, loadingAggregationHistoryError, loadingRepoError,
         loadingRepoMessage, noAggregationHistory } from '../../domain/shared-messages';
import {AuthenticationService} from '../../services/authentication.service';

@Component ({
  selector: 'app-compatibility-monitor-repo',
  templateUrl: 'compatibility-monitor-repo.component.html'
})

export class CompatibilityMonitorRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;
  noAggregations: string;

  repoId = '';
  repoName = '';
  repo: Repository;

  latestAggregations: AggregationDetails[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private authService: AuthenticationService) {}

  ngOnInit() {
    this.readRepoId();
    this.getRepo();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.repoName = `repository with id \'${this.repoId}\'`;
  }

  getRepo() {
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
            if ( this.authService.activateFrontAuthorization &&
                 (this.authService.getUserEmail() !== this.repo.registeredBy.trim()) ) {
              this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
            } else {
              this.getLatestAggregationHistory();
            }
          } else {
            this.errorMessage = loadingRepoError;
          }
        }
      );
    }
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
