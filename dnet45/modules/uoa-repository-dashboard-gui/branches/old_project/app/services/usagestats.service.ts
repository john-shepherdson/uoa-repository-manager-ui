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
  private apiUrl = process.env.API_ENDPOINT + '/sushilite/';

  constructor(private httpClient: HttpClient) { }


  getReportResponse(page: String, pageSize: String, params: URLSearchParams): Observable<ReportResponseWrapper> {
    let url = `${this.apiUrl}getReportResults/${page}/${pageSize}?${params}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<ReportResponseWrapper>(url, headerOptions);
  }


}
