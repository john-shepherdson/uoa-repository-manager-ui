/*
* Created by myrto on 05/11/2018
*/


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ReportResponseWrapper } from '../domain/usageStatsClasses';
import {HttpClient, HttpHeaders} from "@angular/common/http";


const headers = new Headers({ 'Content-Type': 'application/json' });
const httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class UsagestatsService {
  private apiUrl = process.env.API_ENDPOINT + '/piwik/';

  constructor(private http: Http,
              private httpClient: HttpClient) { }


  getReportResponse(params: URLSearchParams): Observable<ReportResponseWrapper> {
    let url = `http://beta.services.openaire.eu/usagestats/sushilite/GetReport/?${params}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<ReportResponseWrapper>(url, headerOptions);
  }


}
