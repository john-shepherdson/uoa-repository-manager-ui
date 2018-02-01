/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Country, Repository, RepositoryInterface, Timezone, Topic } from '../domain/typeScriptClasses';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class RepositoryService {
/*  private apiUrl = 'http://195.134.66.230:8380/uoa-repository-manager-service'; */
  private apiUrl = 'http://194.177.192.121:8380/uoa-repository-manager-service';

  constructor(private http: Http) { }

  getRepositoriesOfCountry(country: string, mode: string): Observable<Repository[]> {
    let url = `${this.apiUrl}/repository/getRepositoriesByCountry/${country}/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository[]>res.json())
      .catch(this.handleError);
  }

  getRepositoriesOfUser(userEmail: string): Observable<Repository[]> {
    let url = `${this.apiUrl}/repository/getRepositoriesOfUser/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository[]>res.json())
      .do(res => console.log(`counted ${res.length} repositories`))
      .catch(this.handleError);
  }


  getRepositoryById(id: string): Observable<Repository> {
    let url = `${this.apiUrl}/repository/getRepositoryById/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository>res.json())
      .do(res => console.log(`got repository with name: ${res.officialName}`))
      .catch(this.handleError);
  }

  getRepositoryInterface(id: string): Observable<RepositoryInterface[]>{
    let url = `${this.apiUrl}/repository/getRepositoryInterface/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <RepositoryInterface[]>res.json())
      .catch(this.handleError);
  }

  getUrlsOfUserRepos(userEmail: string): Observable<string[]>{
    let url = `${this.apiUrl}/repository/getUrlsOfUserRepos/${userEmail}/0/100/`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <string[]>res.json())
      .catch(this.handleError);
  }

  getTimezones(): Observable<Timezone[]>{
    let url = `${this.apiUrl}/repository/getTimezones`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Timezone[]>res.json())
      .catch(this.handleError);
  }

  getCountries(): Observable<Country[]> {
    let url = `${this.apiUrl}/repository/getCountries`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Country[]>res.json())
      .catch(this.handleError);
  }


  getCompatibilityClasses (mode: string): Observable<Map<string,string>> {
    let url = `${this.apiUrl}/repository/getCompatibilityClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,string>>res.json())
      .catch(this.handleError);
  }

  getDatasourceClasses(mode: string): Observable<Map<string,string>>{
    let url = `${this.apiUrl}/repository/getDatasourceClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,string>>res.json())
      .catch(this.handleError);
  }


  updateEnglishName(id: string, englishname: string): Observable<string>{
    let url = `${this.apiUrl}/repository/updateEnglishName`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      englishname: englishname
    });
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url,body,httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
  }

  updateLongtitude(id: string, longtitude: string): Observable<string>{
    let url = `${this.apiUrl}/repository/updateLongtitude`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      logntitude: longtitude
    });
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url,body,httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
  }

  updateLatitude(id: string, latitude: string): Observable<string>{
    let url = `${this.apiUrl}/repository/updateLatitude`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      latitude: latitude
    });
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url,body,httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
  }

  updateLogoUrl(id: string, logoUrl: string): Observable<string>{
    let url = `${this.apiUrl}/repository/updateLogoUrl`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      logoUrl: logoUrl
    });
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url, body, httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
  }

  updateTimezone(id: string, timezone: string): Observable<string>{
    let url = `${this.apiUrl}/repository/updateTimezone`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      timezone: timezone
    });
    console.log(`sending ${body}`);
    httpOptions.withCredentials = true;

    return this.http.post(url, body, httpOptions)
      .map( res => <string>res.json())
      .catch(this.handleError).share();
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
