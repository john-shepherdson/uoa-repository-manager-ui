/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AdvQueryObject, Topic } from '../domain/typeScriptClasses';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class BrokerService {
  /*  private apiUrl = 'http://195.134.66.230:8380/uoa-repository-manager-service'; */
  private apiUrl = 'http://194.177.192.121:8380/uoa-repository-manager-service';

  constructor(private http: Http) { }

  updateEnglishName(query: AdvQueryObject): Observable<string>{
    let url = `${this.apiUrl}/broker/advancedShowEvents/0/100`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify(query);
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url,body,httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
  }


  getTopicsForDataSource(name: string): Observable<Topic[]> {
    let url = `${this.apiUrl}/broker/getTopicsForDatasource/${name}`;
  console.log(`knocking on: ${url}`);
  return this.http.get(url)
    .map( res => <Topic[]>res.json())
    .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = "";
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
