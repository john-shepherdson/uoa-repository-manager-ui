/*
* Created by myrto on 05/11/2018
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportResponseWrapper } from '../domain/usageStatsClasses';
import { environment } from '../../environments/environment';
import {COUNTER_Dataset_Report, COUNTER_Item_Report} from '../domain/sushilite';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
                             .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class UsagestatsService {
  private apiUrl = environment.API_ENDPOINT + '';

  constructor(private httpClient: HttpClient) { }


  getReportResponse(page: String, pageSize: String, params: URLSearchParams): Observable<ReportResponseWrapper> {
    const url = `${this.apiUrl}/sushilite/getReportResults/${page}/${pageSize}?${params}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<ReportResponseWrapper>(url, headerOptions);
  }

  getR5Response(params: URLSearchParams) {
    const url = `${this.apiUrl}/sushiliteR5/getReportResults/?${params}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<COUNTER_Dataset_Report | COUNTER_Item_Report>(url, headerOptions);
  }


}
