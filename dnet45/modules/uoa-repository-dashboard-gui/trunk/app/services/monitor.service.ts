/*
* Created by myrto on 12/05/2017
*/


import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterfaceInformation, JobsOfUser, StoredJob } from "../domain/typeScriptClasses";
import { URLParameter } from '../domain/url-parameter';
import {HttpClient, HttpHeaders} from "@angular/common/http";

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class MonitorService {
  private apiUrl = process.env.API_ENDPOINT + '/monitor/';

  constructor(private http: Http,
              private httpClient: HttpClient) { }

  getJobSummary(jobId: string, groupBy: string): Observable<StoredJob> {
    let url = `${this.apiUrl}getJobSummary?jobId=${jobId}&groupBy=${groupBy}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<StoredJob>(url,headerOptions);
  }

  getJobsOfUser(params: URLParameter[]): Observable<JobsOfUser> {
    let url = `${this.apiUrl}getJobsOfUser`;
    for (let param of params) {
      if (param.key == 'user'){
        url += `?${param.key}=${param.value[0]}`;
      } else {
        url += `&${param.key}=${param.value[0]}`;
      }
    }
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<JobsOfUser>(url,headerOptions);
  }

}
