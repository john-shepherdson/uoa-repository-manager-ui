/*
* Created by myrto on 12/05/2017
*/

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PiwikInfo } from '../domain/typeScriptClasses';
import { Observable } from 'rxjs';
import {URLParameter} from '../domain/url-parameter';
import {PiwikInfoPage} from '../domain/page-content';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class PiwikService {
  private apiUrl = environment.API_ENDPOINT + '/piwik/';

  constructor(private httpClient: HttpClient) { }


  approvePiwikSite(repositoryId: string) {
    const url = `${this.apiUrl}approvePiwikSite/${repositoryId}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, {withCredentials: true, responseType: 'text'});
  }

  enableMetricsForRepository(repoName: string, repoWebsite: string, piwik: PiwikInfo): Observable<PiwikInfo> {
    let url = `${this.apiUrl}enableMetricsForRepository`;
    url = `${url}?officialName=${encodeURIComponent(repoName)}&repoWebsite=${encodeURIComponent(repoWebsite)}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(piwik)}`);

    return this.httpClient.post<PiwikInfo>(url, JSON.stringify(piwik), headerOptions);
  }

  getOpenaireId(id: string) {
    const url = `${this.apiUrl}getOpenaireId/${id}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get(url, {withCredentials: true, responseType: 'text'});
  }

  getPiwikInfo(id: string): Observable<PiwikInfo> {
    const url = `${this.apiUrl}getPiwikSiteForRepo/${id}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<PiwikInfo>(url, headerOptions);
  }

  getPiwikSitesForRepos(urlParams: URLParameter[]): Observable<PiwikInfoPage> {
    const url = `${this.apiUrl}getPiwikSitesForRepos`;
    console.log(`knocking on: ${url}`);
    console.log('urlParams');
    console.log(urlParams);
    console.log(urlParams.length);
    let params = new HttpParams();
    for (const urlParameter of urlParams) {
      for (const value of urlParameter.value) {
        params = params.append(urlParameter.key, value);
      }
    }

    return this.httpClient.get<PiwikInfoPage>(url, {params, withCredentials: true});
  }

  markPiwikSiteAsValidated (repositoryId: string) {
    const url = `${this.apiUrl}markPiwikSiteAsValidated/${repositoryId}`;
    console.log(`knocking on: ${url}`);
    const body = {};

    return this.httpClient.post(url, body, { withCredentials: true, responseType: 'text' });
  }

  savePiwikInfo(piwik: PiwikInfo): Observable<PiwikInfo> {
    const url = `${this.apiUrl}savePiwikInfo`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.post<PiwikInfo>(url, piwik, headerOptions);
  }


}
