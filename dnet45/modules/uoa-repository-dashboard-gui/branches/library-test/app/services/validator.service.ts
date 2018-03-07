/*
* Created by myrto on 1/24/2018
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InterfaceInformation, JobForValidation, RuleSet, StoredJob } from '../domain/typeScriptClasses';
import { apiUrl } from '../domain/tempAPI';


let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class ValidatorService {

  private apiUrl = apiUrl + '/validator/';

  constructor(private http: Http) { }

  /* returns array of sets of rules according to mode (literature, data, cris) */
  getRuleSets(mode: string): Observable<RuleSet[]> {
    let url = `${this.apiUrl}getRuleSets/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url,httpOptions)
      .map(res => <RuleSet[]>res.json())
      .catch(this.handleError);
  }


  getSetsOfRepository(baseUrl: string): Observable<string[]> {
    let url = `${this.apiUrl}getSetsOfRepository?url=${baseUrl}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url,httpOptions)
      .map(res => <string[]>res.json())
      .catch(this.handleError);
  }

  getStoredJobsNew(userEmail: string,
                   jobType:string,
                   offset: string,
                   limit: string,
                   dateFrom: string,
                   dateTo: string,
                   validationStatus: string): Observable<StoredJob[]> {
    let url = `${this.apiUrl}getStoredJobsNew?user=${userEmail}&jobType=${encodeURI(jobType)}&offset=${offset}&limit=${limit}&dateFrom=${dateFrom}&dateTo=${dateTo}&validationStatus=${validationStatus}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url,httpOptions)
      .map(res => <StoredJob[]>res.json())
      .catch(this.handleError);
  }

  /* returns true if there is a repository containing the baseUrl */
  identifyRepository(baseUrl: string): Observable<boolean> {
    let url = `${this.apiUrl}identifyRepository?url=${baseUrl}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url,httpOptions)
      .map(res => <boolean>res.json())
      .catch(this.handleError);
  }

  getInterfaceInformation(baseUrl: string): Observable<InterfaceInformation> {
    let url = `${this.apiUrl}getInterfaceInformation?baseUrl=${encodeURIComponent(baseUrl)}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url,httpOptions)
      .map(res => <InterfaceInformation>res.json())
      .catch(this.handleError);
  }

  reSubmitJobForValidation(id: string): Observable<string> {
    let url = `${this.apiUrl}reSubmitJobForValidation/${id}`;
    console.log(`knocking on: ${url}`);

    httpOptions.withCredentials = true;
    return this.http.post(url,httpOptions)
      .map(res => {
        console.log(`responded ${res.status}`);
        return res.status.toString();
      })
      .catch(this.handleError);
  }

  submitJobForValidation(job: JobForValidation): Observable<string> {
    let url = `${this.apiUrl}submitJobForValidation`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify(job);
    httpOptions.withCredentials = true;
    return this.http.post(url,body,httpOptions)
      .map(res => {
        console.log(`responded ${res.status}`);
        return res.status.toString();
      })
      .catch(this.handleError);
  }


/* from omtd project */
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = "";
    console.log('E R R O R !!!');
    console.log(error);
    if (error instanceof Response) {
      const body = error.text() || '';
      //const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return Observable.throw(errMsg);
  }
}
