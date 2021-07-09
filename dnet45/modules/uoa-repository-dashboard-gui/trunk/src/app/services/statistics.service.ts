/*
* Created by myrto on 05/11/2018
*/


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsageStatsSummary } from '../domain/typeScriptClasses';
import { environment } from '../../environments/environment';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class StatisticsService {
  private apiUrl = environment.API_ENDPOINT + '/stats/';

  constructor(private httpClient: HttpClient) { }


  getStatisticsNumbers(): Observable<UsageStatsSummary> {
    const url = `${this.apiUrl}getStatistics`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<UsageStatsSummary>(url, headerOptions);
  }


}
