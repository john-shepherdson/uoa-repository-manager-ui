/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { PiwikInfo } from '../domain/typeScriptClasses';
import { apiUrl } from '../domain/tempAPI';


const headers = new Headers({ 'Content-Type': 'application/json' });
const httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class PiwikService {
  private apiUrl = `${apiUrl}/piwik/`;

  constructor(private http: Http) { }


  approvePiwikSite(repositoryId: string): Observable<string> {
    let url = `${this.apiUrl}approvePiwikSite/${repositoryId}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map(res => res.status.toString())
      .catch(this.handleError);
  }

  getOpenaireId(id: string) {
    let url = `${this.apiUrl}getOpenaireId/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( oaId => oaId )
      .catch(this.handleError);
  }

  getPiwikInfo(id: string): Observable<PiwikInfo> {
    let url = `${this.apiUrl}getPiwikSiteForRepo/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( piwik => <PiwikInfo>piwik.json() )
      .catch(this.handleError);
  }

  getPiwikSitesForRepos(): Observable<PiwikInfo[]> {
    let url = `${this.apiUrl}getPiwikSitesForRepos`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <PiwikInfo[]>res.json())
      .catch(this.handleError);
  }

  savePiwikInfo(repositoryId: string,
                openaireId: string,
                repositoryName: string,
                country: string,
                requestorName: string,
                requestorEmail: string): Observable<string>{
    let url = `${this.apiUrl}savePiwikInfo?repositoryId=${repositoryId} \ 
               &openaireId=${openaireId} \ 
               &repositoryName=${repositoryName} \
               &country=${country} \
               &requestorName=${requestorName} \
               &requestorEmail=${requestorEmail}`;
    console.log(`knocking on: ${url}`);

    httpOptions.withCredentials = true;
    return this.http.post(url,httpOptions)
      .map( res => {
        console.log(`responded ${res.statusText}`);
        return res.status.toString();
      })
      .catch(this.handleError).share();
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
