/*
* Created by myrto on 12/05/2017
*/

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AggregationDetails,
  Country, MetricsInfo,
  Repository,
  RepositoryInterface,
  RepositorySnippet, RepositorySummaryInfo,
  Timezone,
  Typology
} from '../domain/typeScriptClasses';
import { Observable, of } from 'rxjs';
import { timezones } from '../domain/timezones';
import { typologies } from '../domain/typologies';
import {URLParameter} from '../domain/url-parameter';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
                             .set('Accept', 'application/json'),
  withCredentials: true
};


@Injectable ()
export class RepositoryService {
  private apiUrl = environment.API_ENDPOINT + '/repository/';
  private dashboardAPIUrl = environment.API_ENDPOINT + '/dashboard/';

  constructor(private httpClient: HttpClient) { }

  addInterface(datatype: string, repoId: string, registeredBy: string, newInterface: RepositoryInterface): Observable<RepositoryInterface> {
    const url = `${this.apiUrl}addInterface?datatype=${datatype}&repoId=${repoId}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newInterface)}`);
    return this.httpClient.post<RepositoryInterface>(url, newInterface, headerOptions);
  }

  updateInterface(repoId: string, registeredBy: string, interfaceInfo: RepositoryInterface): Observable<RepositoryInterface> {
    const url = `${this.apiUrl}updateRepositoryInterface?repoId=${repoId}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(interfaceInfo)}`);
    return this.httpClient.post<RepositoryInterface>(url, interfaceInfo, headerOptions);
  }

  deleteInterface(id: string, registeredBy: string) {
    const url = `${this.apiUrl}deleteInterface/?id=${id}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.delete(url, {withCredentials: true, responseType: 'text'});
  }

  addRepository(datatype: string, newRepository: Repository): Observable<Repository> {
    const url = `${this.apiUrl}addRepository?datatype=${datatype}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newRepository)}`);
    return this.httpClient.post<Repository>(url, newRepository, headerOptions);
  }

  updateRepository(repoInfo: Repository): Observable<Repository> {
    const url = `${this.apiUrl}updateRepository`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(repoInfo)}`);
    return this.httpClient.post<Repository>(url, repoInfo, headerOptions);
  }

  getRepositoriesOfCountry(country: string, mode: string): Observable<RepositorySnippet[]> {
    const url = `${this.apiUrl}getRepositoriesByCountry/${country}/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<RepositorySnippet[]>(url, headerOptions);
  }

  getRepositoriesOfUser(userEmail: string): Observable<Repository[]> {
    const url = `${this.apiUrl}getRepositoriesOfUser/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Repository[]>(url, headerOptions);
  }


  getRepositoryById(id: string): Observable<Repository> {
    const url = `${this.apiUrl}getRepositoryById/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Repository>(url, headerOptions);
  }

  getRepositoryInterface(id: string): Observable<RepositoryInterface[]> {
    const url = `${this.apiUrl}getRepositoryInterface/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<RepositoryInterface[]>(url, headerOptions);
  }


  getUrlsOfUserRepos(userEmail: string): Observable<string[]> {
    const url = `${this.apiUrl}getUrlsOfUserRepos/${userEmail}/0/100/`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<string[]>(url, headerOptions);
  }

  getRepositoryAggregations(id: string): Observable<AggregationDetails[]> {
    const url = `${this.apiUrl}getRepositoryAggregations/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<AggregationDetails[]>(url, headerOptions);
  }

  getRepositoryAggregationsByYear(id: string): Observable<Map<string, AggregationDetails[]>> {
    const url = `${this.apiUrl}getRepositoryAggregationsByYear/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Map<string, AggregationDetails[]>>(url, headerOptions);
  }

  getTimezones(): Observable<Timezone[]> {
/*    const url = `${this.apiUrl}getTimezones`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Timezone[]>(url, headerOptions);*/
    return of(<Timezone[]>timezones);
  }

  getTypologies(): Observable<Typology[]> {
/*    const url = `${this.apiUrl}getTypologies`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Typology[]>(url, headerOptions);*/
    return of(<Typology[]>typologies);
  }

  getCountries(): Observable<Country[]> {
    const url = `${this.apiUrl}getCountries`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Country[]>(url, headerOptions);
  }


  getCompatibilityClasses (mode: string): Observable<Map<string, string>> {
    const url = `${this.apiUrl}getCompatibilityClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Map<string, string>>(url, headerOptions);
  }

  getDatasourceClasses(mode: string): Observable<Map<string, string>> {
    const url = `${this.apiUrl}getDatasourceClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Map<string, string>>(url, headerOptions);
  }


  getMetricsInfoForRepository (repoId: string): Observable<MetricsInfo> {
    const url = `${this.apiUrl}getMetricsInfoForRepository/${repoId}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<MetricsInfo>(url, headerOptions);
  }

  getListLatestUpdate(mode: string): Observable<any> {
    const url = `${this.apiUrl}getListLatestUpdate/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<any>(url, headerOptions);
  }

  searchRegisteredRepositories(country, typology, englishName, officialName, requestSortBy, order, page, pageSize, urlParams: URLParameter[]) {
    const url = `${this.apiUrl}searchRegisteredRepositories/${page}/${pageSize}`;
    console.log(`knocking on: ${url}`);

    console.log('urlParams');
    console.log(urlParams);
    console.log(urlParams.length);
    let params = new HttpParams();
    for (const urlParameter of urlParams) {
      for (const value of urlParameter.value) {
        params = params.append(urlParameter.key, value);
        console.log(params);
      }
    }
    console.log('final params');
    console.log(params);

    return this.httpClient.get<RepositorySnippet[]>(url, {params, withCredentials: true});
  }

  getRepositoriesSummaryInfo(userEmail: string): Observable<RepositorySummaryInfo[]> {
    const url = `${this.dashboardAPIUrl}getRepositoriesSummary/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<RepositorySummaryInfo[]>(url, headerOptions);
  }
}
