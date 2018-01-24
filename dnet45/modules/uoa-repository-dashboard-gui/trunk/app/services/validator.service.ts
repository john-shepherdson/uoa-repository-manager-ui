/*
* Created by myrto on 1/24/2018
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
};

@Injectable ()
export class ValidatorService {

  /*  private apiUrl = 'http://195.134.66.230:8380/uoa-repository-manager-service';*/
  private apiUrl = 'http://194.177.192.121:8380/uoa-repository-manager-service';

  constructor(private http: Http) { }

  /* returns true if there is a repository containing the identifier */
  identifyRepository(identifier: string): Observable<boolean> {
    let url = `${this.apiUrl}/validator/identifyRepository/${identifier}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map(res => console.log(res))
      .catch(this.handleError);
  }

  /* from omtd project */
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = "";
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
