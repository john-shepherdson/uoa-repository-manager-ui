import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RepositoryService } from '../../services/repository.service';
import {
  AggregationDetails, BrokerSummary, BrowseEntry, CollectionMonitorSummary,
  MetricsInfo, PiwikInfo,
  Repository,
  RepositorySnippet,
  RepositorySummaryInfo, UsageSummary
} from '../../domain/typeScriptClasses';
import {
  loadingAggregationHistory,
  loadingAggregationHistoryError, loadingMetrics, loadingMetricsError,
  loadingReposMessage, loadingSubscriptions, loadingTopics, loadingTopicsError,
  loadingUserRepoInfoEmpty, noAggregationHistory, noSubscriptionsFound, noTopicsFound,
  reposRetrievalError
} from "../../domain/shared-messages";
import {DashboardService} from "../../services/dashboard.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {PiwikService} from "../../services/piwik.service";

@Component ({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  reposOfUser: Repository[] = [];
  selectedRepo: Repository = null;
  // tilesView: boolean;
  errorMessage: string;
  noRepos: string;
  loadingMessage: string;

  constructor(private authService: AuthenticationService,
              private repositoryService: RepositoryService,
              private dashboardService: DashboardService,
              private piwikService: PiwikService,
              private sanitizer: DomSanitizer) { }

  repositories: RepositorySummaryInfo[] = [];
  userEmail: string;

  loading: boolean = true;


  // Aggregations
  collectionMonitorSummary: CollectionMonitorSummary;
  lastIndexedVersion: AggregationDetails;
  latestAggregations: AggregationDetails[] = [];
  errorAggregationsMessage: string;
  noAggregations: string;
  loadingAggregationsMessage: string;

  // Usage Statistics
  usageSummary: UsageSummary;
  piwik: PiwikInfo;
  repoMetrics: MetricsInfo;
  errorUsageStatsMessage: string;
  noUsageStats: string;
  loadingUsageStatsMessage: string;
  pageViews = '--';
  totalViews = '--';
  totalDownloads = '--';
  viewsUrl: SafeResourceUrl;
  downloadsUrl: SafeResourceUrl;

  // Broker
  brokerSummary: BrokerSummary;
  errorTopicsMessage: string;
  noTopics: string;
  loadingTopicsMessage: string;
  errorSubscriptionsMessage: string;
  noSubscriptions: string;
  loadingSubscriptionsMessage: string;
  totalNumberOfEvents: number = 0;
  moreList: BrowseEntry[] = [];
  missingList: BrowseEntry[] = [];
  totalMore: number = 0;
  totalMissing: number = 0;


  ngOnInit() {
    // this.getUserEmail();
    this.userEmail = sessionStorage.getItem('email');
    if (this.userEmail) {
      this.getReposOfUser();
      // this.getRepositoriesSummaryInfo(this.userEmail);
    }
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");
    body.classList.remove("page_heading_active");
  }

  getReposOfUser(): void {
    this.loadingMessage = loadingReposMessage;
    this.repositoryService.getRepositoriesOfUser(this.authService.getUserEmail())
      .subscribe(
        repos => {
          this.sortRepositoriesByName(repos);
          if(this.reposOfUser && this.reposOfUser.length>0) {
            this.selectedRepo = this.reposOfUser[0];
            this.getSelectedRepositorySummaryInfo(this.reposOfUser[0]);
          }
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = reposRetrievalError;
        },
        () => {
          this.loadingMessage = '';
          if (!this.reposOfUser || !this.reposOfUser.length) {
            this.noRepos = loadingUserRepoInfoEmpty;
          }
        }
      );
  }

  sortRepositoriesByName(repos: Repository[]) {
    this.reposOfUser = repos.sort( function(a, b) {
      if (a.officialName < b.officialName) {
        return -1;
      } else if (a.officialName > b.officialName) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  changeSelectedRepository(repoId: string) {
    this.selectedRepo =  this.reposOfUser.find(x => x.id == repoId);
    this.getSelectedRepositorySummaryInfo(this.selectedRepo);
  }

  getSelectedRepositorySummaryInfo(selectedRepo: Repository) {

    // Aggregations
    this.loadingAggregationsMessage = loadingAggregationHistory;
    this.latestAggregations = [];
    this.lastIndexedVersion = null;
    this.dashboardService.getCollectionMonitorSummary(selectedRepo.id, 5).subscribe(
      collectionMonitorSummary => this.getCollectionMonitorSummary(collectionMonitorSummary),
      error => {
        this.loadingAggregationsMessage = '';
        this.errorAggregationsMessage = loadingAggregationHistoryError;
      },
      () => {
        this.loadingAggregationsMessage = '';
        this.errorAggregationsMessage = '';
      }
    );

    // Usage Statistics
    this.loadingUsageStatsMessage = loadingMetrics;
    this.usageSummary = null;
    this.piwik = null;
    this.repoMetrics = null;
    this.pageViews = '--';
    this.totalViews = '--';
    this.totalDownloads = '--';
    this.viewsUrl = null;
    this.downloadsUrl = null;
    this.dashboardService.getUsageSummary(selectedRepo.id).subscribe(
      usageSummary => this.getUsageSummary(usageSummary),
      error => {
        this.loadingUsageStatsMessage = '';
        this.errorUsageStatsMessage = loadingMetricsError;
        console.log(error);
      } ,
      () => {
        this.loadingUsageStatsMessage = '';
        this.errorUsageStatsMessage = '';
      }
    );

    // Broker
    this.loadingTopicsMessage = loadingTopics;
    this.loadingSubscriptionsMessage = loadingSubscriptions;
    this.brokerSummary = null;
    this.totalNumberOfEvents = 0;
    this.moreList = [];
    this.missingList = [];
    this.totalMore = 0;
    this.totalMissing = 0;
    this.dashboardService.getBrokerSummary(this.userEmail, this.getCorrectName()).subscribe(
      brokerSummary => this.getBrokerSummary(brokerSummary),
      error => {
        this.loadingTopicsMessage = '';
        this.loadingSubscriptionsMessage = '';
        this.errorTopicsMessage = loadingTopicsError;
        this.errorSubscriptionsMessage = 'Failed to load the subscriptions for your datasource';
        console.log(error);
      },
      () => {
        this.loadingTopicsMessage = '';
        this.loadingSubscriptionsMessage = '';
        this.errorTopicsMessage = '';
        this.errorSubscriptionsMessage = '';
      }
    );

  }

  getCollectionMonitorSummary(collectionMonitorSummary: CollectionMonitorSummary) {

    this.latestAggregations = collectionMonitorSummary.aggregationDetails;
    this.lastIndexedVersion = collectionMonitorSummary.lastIndexedVersion;

    if ( !this.latestAggregations || (this.latestAggregations.length === 0) ) {
      this.noAggregations = noAggregationHistory;
    }
  }

  getBrokerSummary(brokerSummary: BrokerSummary) {

    this.noSubscriptions = '';
    this.noTopics = '';

    this.brokerSummary = brokerSummary;

    if(this.brokerSummary.userSubs==null)
      this.noSubscriptions = noTopicsFound;
    if(this.brokerSummary.topicsForDatasource==null)
      this.noTopics = noSubscriptionsFound;

    this.totalNumberOfEvents = 0;
    this.totalMore = 0;
    this.totalMissing = 0;
    if(brokerSummary.topicsForDatasource) {
      for (let browseEntry of brokerSummary.topicsForDatasource) {
        this.totalNumberOfEvents += browseEntry.size;
        if (browseEntry.value.startsWith('ENRICH/MORE')) {
          this.totalMore += browseEntry.size;
          this.moreList.push(browseEntry);
        } else if (browseEntry.value.startsWith('ENRICH/MISSING')) {
          this.totalMissing += browseEntry.size;
          this.missingList.push(browseEntry);
        }
      }
    }


  }

  getUsageSummary(usageSummary: UsageSummary) {

    this.noUsageStats = '';

    if(usageSummary.piwikInfo==null)
      this.noUsageStats = 'This repository does not have our Usage Statistics service enabled yet.'
    else {
      this.usageSummary = usageSummary;
      this.piwik = usageSummary.piwikInfo;
      this.repoMetrics = usageSummary.metricsInfo;
      if (this.repoMetrics.metricsNumbers.pageviews) {
        this.pageViews = this.repoMetrics.metricsNumbers.pageviews;
      }
      if (this.repoMetrics.metricsNumbers.total_views) {
        this.totalViews = this.repoMetrics.metricsNumbers.total_views;
      }
      if (this.repoMetrics.metricsNumbers.total_downloads) {
        this.totalDownloads = this.repoMetrics.metricsNumbers.total_downloads;
      }
      this.getViewsUrl();
      this.getDownloadsUrl();
    }
  }

  getViewsUrl () {
    this.viewsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.repoMetrics.diagramsBaseURL}merge.php?com=query
      &data=[{"query":"dtsrcRepoViews","dtsrcName":"${this.piwik.openaireId}",
      "table":"","fields":[{"fld":"sum","agg":"sum","type":"chart","yaxis":1,"c":false}],
      "xaxis":{"name":"month","agg":"sum"},"group":"","color":"","type":"chart","size":30,
      "sort":"xaxis","xStyle":{"r":-30,"s":"0","l":"-","ft":"-","wt":"-"},"title":"","subtitle":"",
      "xaxistitle":"","yaxisheaders":["Monthly views"],"generalxaxis":"","theme":0,"in":[]}]
      &info_types=["spline"]&stacking=&steps=false&fontFamily=Courier&spacing=[5,0,0,0]
      &style=[{"color":"rgba(0, 0, 0, 1)","size":"18"},{"color":"rgba(0, 0, 0, 1)","size":"18"},
      {"color":"000000","size":""},{"color":"000000","size":""}]&backgroundColor=rgba(255,255,255,1)
      &colors[]=rgba(124,181, 236, 1)&colors[]=rgba(67, 67, 72, 1)&colors[]=rgba(144, 237, 125,1)
      &colors[]=rgba(247, 163, 92, 1)&colors[]=rgba(128, 133, 233,1)&colors[]=rgba(241, 92, 128, 1)
      &colors[]=rgba(228, 211, 84,1)&colors[]=rgba(43, 144, 143, 1)&colors[]=rgba(244, 91, 91,1)
      &colors[]=rgba(145, 232, 225,1)&xlinew=0&ylinew=1&legends=true&tooltips=true&persistent=false`
    );
  }

  getDownloadsUrl () {
    this.downloadsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.repoMetrics.diagramsBaseURL}merge.php?com=query
      &data=[{"query":"dtsrcRepoDownloads","dtsrcName":"${this.piwik.openaireId}",
      "table":"","fields":[{"fld":"sum","agg":"sum","type":"chart","yaxis":1,"c":false}],
      "xaxis":{"name":"month","agg":"sum"},"group":"","color":"","type":"chart","size":30,
      "sort":"xaxis","xStyle":{"r":-30,"s":"0","l":"-","ft":"-","wt":"-"},"title":"","subtitle":"",
      "xaxistitle":"","yaxisheaders":["Monthly downloads"],"generalxaxis":"","theme":0,"in":[]}]
      &info_types=["spline"]&stacking=&steps=false&fontFamily=Courier&spacing=[5,0,0,0]
      &style=[{"color":"rgba(0, 0, 0, 1)","size":"18"},{"color":"rgba(0, 0, 0,1)","size":"18"},
      {"color":"000000","size":""},{"color":"000000","size":""}]&backgroundColor=rgba(255,255,255,1)
      &colors[]=rgba(124, 181, 236, 1)&colors[]=rgba(67, 67, 72, 1)&colors[]=rgba(144, 237, 125,1)
      &colors[]=rgba(247, 163, 92, 1)&colors[]=rgba(128, 133, 233,1)&colors[]=rgba(241, 92, 128, 1)
      &colors[]=rgba(228, 211, 84,1)&colors[]=rgba(43, 144, 143, 1)&colors[]=rgba(244, 91, 91,1)
      &colors[]=rgba(145, 232, 225,1)&xlinew=0&ylinew=1&legends=true&tooltips=true&persistent=false`
    );
  }

  getCorrectName() {
    const temp = this.selectedRepo.officialName.split('|');
    let correctName = temp[0];
    let repoName = temp[0];
    for (let i = 1; i < temp.length; i++) {
      correctName += `/${temp[i]}`;
      repoName += ` | ${temp[i]}`;
    }

    return correctName;
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }

  getUserEmail() {
    this.userEmail = this.authService.getUserEmail();
  }

  getRepos() {
    console.log('in getRepos');
    this.getRepositoriesSummaryInfo(this.userEmail);
  }

  getRepositoriesSummaryInfo(userEmail: string) {
    this.repositoryService.getRepositoriesSummaryInfo(userEmail).subscribe(
      repositories => { this.repositories = repositories; this.loading=false },
      error => { console.log('Errrrror'); this.loading=false },
      () => { console.log(this.repositories); this.loading=false }
    );
  }
}
