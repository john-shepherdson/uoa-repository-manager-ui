import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AggregationDetails, BrokerSummary, CollectionMonitorSummary,
  Country, MetricsInfo,
  Repository,
  RepositoryInterface,
  RepositorySnippet, RepositorySummaryInfo,
  Timezone,
  Typology, UsageSummary
} from '../domain/typeScriptClasses';
import { Observable, of } from 'rxjs';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};


@Injectable ()
export class DashboardService {

  private dashboardAPIUrl = environment.API_ENDPOINT + '/dashboard/';

  constructor(private httpClient: HttpClient) { }

  getRepositoriesSummaryInfo(userEmail: string): Observable<RepositorySummaryInfo[]> {
    const url = `${this.dashboardAPIUrl}getRepositoriesSummary/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<RepositorySummaryInfo[]>(url, headerOptions);
  }

  getCollectionMonitorSummary(id: string, items: number): Observable<CollectionMonitorSummary> {
    const url = `${this.dashboardAPIUrl}collectionMonitorSummary/${id}?size=${items}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<CollectionMonitorSummary>(url, headerOptions);
  }

  getUsageSummary(repoId: string): Observable<UsageSummary> {
    const url = `${this.dashboardAPIUrl}usageSummary/${repoId}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<UsageSummary>(url, headerOptions);
  }

  getBrokerSummary(repoName: string): Observable<BrokerSummary> {
    const url = `${this.dashboardAPIUrl}brokerSummary/${encodeURIComponent(repoName)}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<BrokerSummary>(url, headerOptions);
  }
}
