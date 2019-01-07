/*
* Created by myrto on 05/11/2018
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportResponseWrapper } from '../domain/usageStatsClasses';
import { environment } from '../../environments/environment';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
                             .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class UsagestatsService {
  private apiUrl = environment.API_ENDPOINT + '/sushilite/';

  constructor(private httpClient: HttpClient) { }


  getReportResponse(page: String, pageSize: String, params: URLSearchParams): Observable<ReportResponseWrapper> {
    const url = `${this.apiUrl}getReportResults/${page}/${pageSize}?${params}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<ReportResponseWrapper>(url, headerOptions);
  }


}
