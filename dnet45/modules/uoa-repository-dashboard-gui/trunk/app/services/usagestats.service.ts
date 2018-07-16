/*
* Created by myrto on 05/11/2018
*/


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ReportResponseWrapper } from '../domain/usageStatsClasses';


const headers = new Headers({ 'Content-Type': 'application/json' });
const httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class UsagestatsService {
  private apiUrl = process.env.API_ENDPOINT + '/piwik/';

  constructor(private http: Http) { }


  getReportResponse(params: URLSearchParams): Observable<ReportResponseWrapper> {
    let url = `http://beta.services.openaire.eu/usagestats/sushilite/GetReport/?${params}`;
    console.log(`knocking on: ${url}`);
    httpOptions.withCredentials = true;
    return this.http.get(url, httpOptions)
      .map(res => <ReportResponseWrapper>res.json())
      .catch(this.handleError);
  }

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
