import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { RepositoryService } from '../../../services/repository.service';
import {
  AggregationDetails, BrokerSummary, BrowseEntry, CollectionMonitorSummary,
  MetricsInfo, PiwikInfo,
  Repository, StoredJob, UsageSummary
} from '../../../domain/typeScriptClasses';
import {
  loadingAggregationHistory, loadingAggregationHistoryError, loadingMetrics,
  loadingMetricsError, loadingSubscriptions, loadingTopics, loadingTopicsError,
  noAggregationHistory, noSubscriptionsFound, noTopicsFound,
  loadingJobSummary, loadingJobSummaryError
} from '../../../domain/shared-messages';
import {DashboardService} from '../../../services/dashboard.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {PiwikService} from '../../../services/piwik.service';
import {ValidatorService} from '../../../services/validator.service';
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../../services/shared.service";

@Component ({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  repository: Repository = null;
  errorMessage: string;
  loadingMessage: string;

  constructor(private authService: AuthenticationService,
              private repositoryService: RepositoryService,
              private sharedService: SharedService,
              private dashboardService: DashboardService,
              private piwikService: PiwikService,
              private validatorService: ValidatorService,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute) {
  }

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
  shortRepositoryId: string;
  currentDate: string;

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

  // Validation
  storedJob: StoredJob[] = [];
  noValidationsMessage: string;
  errorValidationsMessage: string;
  loadingJobSummaryMessage: string;

  ngOnInit() {

    if(this.sharedService.getRepository()) {
      this.repository = this.sharedService.getRepository();
      this.getSelectedRepositorySummaryInfo(this.repository);
    }

    this.sharedService.repository$.subscribe(
      r => {
        this.repository = r;
        // console.log("RepositoryID: ", this.repository.id);
        this.getSelectedRepositorySummaryInfo(this.repository);
      }
    );

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");

    const currentTime = new Date();
    this.currentDate = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1);
  }

  getSelectedRepositorySummaryInfo(repository: Repository) {

    // Aggregations
    this.loadingAggregationsMessage = loadingAggregationHistory;
    this.latestAggregations = [];
    this.lastIndexedVersion = null;
    this.dashboardService.getCollectionMonitorSummary(repository.id, 5).subscribe(
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
    this.shortRepositoryId = null;
    this.dashboardService.getUsageSummary(repository.id).subscribe(
      usageSummary => this.getUsageSummary(usageSummary),
      error => {
        this.loadingUsageStatsMessage = '';
        this.errorUsageStatsMessage = loadingMetricsError;
        console.log(error);
      } ,
      () => {
        this.shortRepositoryId = repository.id.replace(/_/g, '').replace('::', ':');
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
    this.dashboardService.getBrokerSummary(this.getCorrectName()).subscribe(
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

    // Validation
    this.loadingJobSummaryMessage = loadingJobSummary;
    this.noValidationsMessage = '';
    this.errorValidationsMessage = '';
    this.validatorService.getValidationSummary(repository.id).subscribe(
      validationSummary => {
        this.storedJob = validationSummary;
        // console.log(validationSummary);
      },
      error => {
        this.errorValidationsMessage = loadingJobSummaryError;
        this.loadingJobSummaryMessage = '';
        console.log(error);
      } ,
      () => {
        this.getValidationSummary(this.storedJob);
        this.loadingJobSummaryMessage = '';
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

    if (usageSummary.piwikInfo == null) {
      this.noUsageStats = 'This repository does not have our Usage Statistics service enabled yet';
    } else {
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

  getValidationSummary(validationSummary: StoredJob[]) {
    if (validationSummary == null) { this.noValidationsMessage = 'There is no validation history for this repository at the moment'; }
  }

  getViewsUrl () {

    let encodedURL = encodeURIComponent('{"library":"HighCharts","chartDescription":{"queries":[{"name":"Monthly views","type":"line","query":{"name":"usagestats.views.monthly", "parameters":["' + this.piwik.openaireId + '"], "profile":"OpenAIRE All-inclusive" }}],"chart":{"backgroundColor":"#FFFFFFFF","borderColor":"#335cadff","borderRadius":0,"borderWidth":0,"plotBorderColor":"#ccccccff","plotBorderWidth":0},"title":{"text":""},"subtitle":{},"yAxis":{"title":{"text":"Monthly views"}},"xAxis":{"title":{}},"lang":{"noData":"No Data available for the Query"},"exporting":{"enabled":false},"plotOptions":{"series":{"dataLabels":{"enabled":false}}},"legend":{"enabled":false},"credits":{"href":null,"enabled":true,"text":"Created by OpenAIRE via HighCharts"}}}');
    this.viewsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.repoMetrics.diagramsBaseURL}chart?json=${encodedURL}`);
  }

  getDownloadsUrl () {

    let encodedURL = encodeURIComponent('{"library":"HighCharts","chartDescription":{"queries":[{"name":"Monthly downloads","type":"line","query":{"name":"usagestats.downloads.monthly", "parameters":["' + this.piwik.openaireId + '"], "profile":"OpenAIRE All-inclusive" }}],"chart":{"backgroundColor":"#FFFFFFFF","borderColor":"#335cadff","borderRadius":0,"borderWidth":0,"plotBorderColor":"#ccccccff","plotBorderWidth":0},"title":{"text":""},"subtitle":{},"yAxis":{"title":{"text":"Monthly downloads"}},"xAxis":{"title":{}},"lang":{"noData":"No Data available for the Query"},"exporting":{"enabled":false},"plotOptions":{"series":{"dataLabels":{"enabled":false}}},"legend":{"enabled":false},"credits":{"href":null,"enabled":true,"text":"Created by OpenAIRE via HighCharts"}}}');
    this.downloadsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.repoMetrics.diagramsBaseURL}chart?json=${encodedURL}`);
  }

  getCorrectName() {
    const temp = this.repository.officialname.split('|');
    let correctName = temp[0];
    let repoName = temp[0];
    for (let i = 1; i < temp.length; i++) {
      correctName += `/${temp[i]}`;
      repoName += ` | ${temp[i]}`;
    }

    return correctName;
  }
}
