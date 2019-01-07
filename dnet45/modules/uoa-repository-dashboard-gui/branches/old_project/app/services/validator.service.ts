/*
* Created by myrto on 1/24/2018
*/

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InterfaceInformation, JobForValidation, RuleSet, StoredJob } from '../domain/typeScriptClasses';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import any = jasmine.any;


let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class ValidatorService {

  private apiUrl = process.env.API_ENDPOINT + '/validator/';

    constructor(private http: Http,
                private httpClient: HttpClient) { }

  /* returns array of sets of rules according to mode (literature, data, cris) */
  getRuleSets(mode: string): Observable<RuleSet[]> {
    let url = `${this.apiUrl}getRuleSets/${mode}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get(url,headerOptions);
  }


  getSetsOfRepository(baseUrl: string): Observable<string[]> {
    let url = `${this.apiUrl}getSetsOfRepository?url=${baseUrl}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<string[]>(url,headerOptions);
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

    return this.httpClient.get<StoredJob[]>(url,headerOptions);
  }

  /* returns true if there is a repository containing the baseUrl */
  identifyRepository(baseUrl: string): Observable<boolean> {
    let url = `${this.apiUrl}identifyRepository?url=${baseUrl}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<boolean>(url,headerOptions);
  }

  getInterfaceInformation(baseUrl: string): Observable<InterfaceInformation> {
    let url = `${this.apiUrl}getInterfaceInformation?baseUrl=${encodeURIComponent(baseUrl)}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<InterfaceInformation>(url,headerOptions);
  }

  reSubmitJobForValidation(id: string, userEmail: string) {
    let url = `${this.apiUrl}reSubmitJobForValidation/${userEmail}/${id}`;
    console.log(`knocking on: ${url}`);
    const body = {};

    return this.httpClient.post(url, body, {withCredentials: true, responseType: 'text'});
  }

  submitJobForValidation(job: JobForValidation): Observable<JobForValidation> {
    let url = `${this.apiUrl}submitJobForValidation`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify(job);

    return this.httpClient.post<JobForValidation>(url, body, headerOptions);
  }

}
