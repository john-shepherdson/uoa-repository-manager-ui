/*
* Created by myrto on 12/05/2017
*/


import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterfaceInformation, JobsOfUser, StoredJob } from "../domain/typeScriptClasses";
import { apiUrl } from '../domain/tempAPI';
import { URLParameter } from '../domain/url-parameter';

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class MonitorService {
  /*private apiUrl = apiUrl + '/monitor/';*/
  private apiUrl = process.env.API_ENDPOINT + '/monitor/';

  constructor(private http: Http) { }

  getJobSummary(jobId: string, groupBy: string): Observable<StoredJob> {
    let url = `${this.apiUrl}getJobSummary?jobId=${jobId}&groupBy=${groupBy}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map(res => <StoredJob>res.json() )
      .catch(this.handleError);
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
    return this.http.get(url)
      .map(res => <JobsOfUser>res.json() )
      .catch(this.handleError);
  }


  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = "";
    console.log(`E R R O R !!!`);
    console.log(error);
    if (error instanceof Response) {
      const body = error.text() || '';
      //const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
      console.log(errMsg);
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return Observable.throw(errMsg);
  }

}
