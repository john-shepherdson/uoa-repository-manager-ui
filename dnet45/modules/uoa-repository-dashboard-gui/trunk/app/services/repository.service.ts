/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import {PiwikInfo, Repository} from '../domain/typeScriptClasses';
import {of} from "rxjs/observable/of";
import 'rxjs/add/operator/map';
import {Http, Response} from '@angular/http';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
};

@Injectable ()
export class RepositoryService {
/*  private apiUrl = 'http://195.134.66.230:8380/uoa-repository-manager-service';*/
  private apiUrl = 'http://194.177.192.121:8380/uoa-repository-manager-service';

  constructor(private http: Http) { }

  getRepositoriesOfUser (userEmail: string): Observable<Repository[]> {
    let url = `${this.apiUrl}/repository/getRepositoriesOfUser/${userEmail}/0/10`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository[]>res.json())
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
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return Observable.throw(errMsg);
  }
}
