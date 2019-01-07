/*
* Created by myrto on 12/05/2017
*/


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { PiwikInfo } from '../domain/typeScriptClasses';
import {HttpClient, HttpHeaders} from "@angular/common/http";


const headers = new Headers({ 'Content-Type': 'application/json' });
const httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class PiwikService {
  private apiUrl = process.env.API_ENDPOINT + '/piwik/';

  constructor(private http: Http,
              private httpClient: HttpClient) { }


  approvePiwikSite(repositoryId: string) {
    let url = `${this.apiUrl}approvePiwikSite/${repositoryId}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, {withCredentials: true, responseType: 'text'});
  }

  enableMetricsForRepository(repoName: string, repoWebsite: string, piwik: PiwikInfo): Observable<PiwikInfo> {
    let url = `${this.apiUrl}enableMetricsForRepository?officialName=${encodeURIComponent(repoName)}&repoWebsite=${encodeURIComponent(repoWebsite)}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(piwik)}`);

    return this.httpClient.post<PiwikInfo>(url, JSON.stringify(piwik),headerOptions);
  }

  getOpenaireId(id: string) {
    let url = `${this.apiUrl}getOpenaireId/${id}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get(url, {withCredentials: true, responseType: 'text'});
  }

  getPiwikInfo(id: string): Observable<PiwikInfo> {
    let url = `${this.apiUrl}getPiwikSiteForRepo/${id}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<PiwikInfo>(url, headerOptions);
  }

  getPiwikSitesForRepos(): Observable<PiwikInfo[]> {
    let url = `${this.apiUrl}getPiwikSitesForRepos`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<PiwikInfo[]>(url, headerOptions);
  }


  markPiwikSiteAsValidated (repositoryId: string) {
    let url = `${this.apiUrl}markPiwikSiteAsValidated/${repositoryId}`;
    console.log(`knocking on: ${url}`);
    const body = {};

    return this.httpClient.post(url, body,{withCredentials: true, responseType:'text'});
  }

  savePiwikInfo(piwik: PiwikInfo): Observable<PiwikInfo> {
    let url = `${this.apiUrl}savePiwikInfo`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.post<PiwikInfo>(url,piwik,headerOptions);
  }


}
