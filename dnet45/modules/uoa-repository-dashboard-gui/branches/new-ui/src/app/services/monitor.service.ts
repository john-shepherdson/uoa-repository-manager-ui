/*
* Created by myrto on 12/05/2017
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { JobsOfUser, StoredJob } from '../domain/typeScriptClasses';
import { URLParameter } from '../domain/url-parameter';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class MonitorService {
  private apiUrl = environment.API_ENDPOINT + '/monitor/';

  constructor(private httpClient: HttpClient) { }

  getJobSummary(jobId: string, groupBy: string): Observable<StoredJob> {
    const url = `${this.apiUrl}getJobSummary?jobId=${jobId}&groupBy=${groupBy}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<StoredJob>(url, headerOptions);
  }

  getJobsOfUser(params: URLParameter[]): Observable<JobsOfUser> {
    let url = `${this.apiUrl}getJobsOfUser`;
    for (const param of params) {
      if (param.key === 'user') {
        url += `?${param.key}=${param.value[0]}`;
      } else {
        url += `&${param.key}=${param.value[0]}`;
      }
    }
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<JobsOfUser>(url, headerOptions);
  }

}
