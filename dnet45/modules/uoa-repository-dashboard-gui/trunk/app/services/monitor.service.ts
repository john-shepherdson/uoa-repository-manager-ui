/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterfaceInformation, JobsOfUser, StoredJob } from "../domain/typeScriptClasses";
import { apiUrl } from '../domain/tempAPI';

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class MonitorService {
  private apiUrl = apiUrl + '/monitor/';

  constructor(private http: Http) { }

  getJobSummary(jobId: string, groupBy: string): Observable<StoredJob> {
    let url = `${this.apiUrl}getJobSummary?jobId=${jobId}&groupBy=${groupBy}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map(res => <StoredJob>res.json() )
      .catch(this.handleError);
  }

  getJobsOfUser(userEmail: string,
                jobType:string,
                offset: string,
                limit: string,
                dateFrom: string,
                dateTo: string,
                validationStatus: string,
                includeJobsTotal): Observable<JobsOfUser> {
    let url = `${this.apiUrl}getJobsOfUser?user=${userEmail}`;
    if (jobType != '') {
      url = `${url}&jobType=${encodeURI(jobType)}&offset=${offset}&limit=${limit}&validationStatus=${validationStatus}&includeJobsTotal=${includeJobsTotal}`;
    } else {
      url = `${url}&offset=${offset}&limit=${limit}&validationStatus=${validationStatus}&includeJobsTotal=${includeJobsTotal}`;
    }
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      userEmail: userEmail,
      jobType: jobType,
      offset: offset,
      limit: limit,
      dateFrom: dateFrom,
      dateTo: dateTo,
      validationStatus: validationStatus,
      includeJobsTotal: includeJobsTotal
    });

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
