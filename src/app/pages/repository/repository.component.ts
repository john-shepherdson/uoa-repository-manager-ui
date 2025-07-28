import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../services/repository.service';
import { AuthenticationService } from '../../services/authentication.service';
import {ActivatedRoute, ActivationStart, NavigationEnd, Router} from '@angular/router';
import {AggregationDetails, Repository, RepositoryInterface} from '../../domain/typeScriptClasses';
import {
  formInfoLoading,
  loadingAggregationHistory,
  loadingAggregationHistoryError,
  loadingRepoError,
  noAggregationHistory
} from '../../domain/shared-messages';
import { SharedService } from '../../services/shared.service';

@Component ({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
})

export class RepositoryComponent implements OnInit {

  repositoryId: string;
  repository: Repository;
  repositoryInterfaces: RepositoryInterface[] = [];
  latestAggregations: AggregationDetails[] = [];

  loadingMessage: string = '';
  errorMessage: string = '';

  open = true;
  hasSidebar = true;
  hasAdminMenu = false;
  hover = false;

  constructor(private repoService: RepositoryService,
              private sharedService: SharedService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {

    route.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.repositoryId = this.route.snapshot.paramMap.get('id');
      this.getRepository();
    });

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        console.log(evt);
        this.findChildRouteData();
      }
    });
  }

  ngOnInit() {
    // console.log("ngOnit repository component");
  }

  getRepository() {
    this.errorMessage = '';

    if (this.repositoryId) {
      this.loadingMessage = 'Retrieving datasource info';
      this.repoService.getRepositoryById(this.repositoryId).subscribe(
        repository => {
          console.log('Repository component - Repository id: ' + repository.id);
          this.sharedService.setRepository(repository);
          this.loadingMessage = '';
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        },
      () => { this.getLatestAggregationHistory(); }
      );

      this.sharedService.repository$.subscribe(r => this.repository = r);
    }
  }

  getLatestAggregationHistory() {
    this.repoService.getRepositoryAggregations(this.repositoryId).subscribe(
      aggr => this.latestAggregations = aggr,
      error => this.errorMessage = loadingAggregationHistoryError
    );
  }

  findChildRouteData() {

    this.hasSidebar = false;
    // this.showFooter = true;

    console.log(this.route.snapshot);

    let child = this.route.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data) {
        if (child.snapshot.data['hasSidebar'] !== undefined) {
          this.hasSidebar = child.snapshot.data['hasSidebar'];
        }
        // if (child.snapshot.data['showFooter'] !== undefined)
        //   this.hasSidebar = child.snapshot.data['showFooter'];
        return null;
      } else {
        return null;
      }
    }
  }

  onHoverChange(state: boolean) {
    this.hover = state;
  }

}
