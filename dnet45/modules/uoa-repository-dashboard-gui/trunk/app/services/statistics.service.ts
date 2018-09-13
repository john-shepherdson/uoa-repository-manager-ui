/*
* Created by myrto on 05/11/2018
*/


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ReportResponseWrapper } from '../domain/usageStatsClasses';
import {HttpClient, HttpHeaders} from "@angular/common/http";


const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class StatisticsService {
  private apiUrl = process.env.API_ENDPOINT + '/stats/';

  constructor(private httpClient: HttpClient) { }


  getStatisticsNumbers(): Observable<Map<string,string>> {
    let url = `${this.apiUrl}getStatistics`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string,string>>(url, headerOptions);
  }


}
