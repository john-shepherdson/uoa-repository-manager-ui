/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Country, MetricsInfo, Repository, RepositoryInterface, Timezone } from '../domain/typeScriptClasses';
import { apiUrl } from '../domain/tempAPI';

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class RepositoryService {
  private apiUrl = apiUrl + '/repository/';

  constructor(private http: Http) { }

  addInterface(datatype: string, repoId: string, newInterface: RepositoryInterface): Observable<RepositoryInterface> {
    let url = `${this.apiUrl}addInterface?datatype=${datatype}&repoId=${repoId}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newInterface)}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,newInterface,httpOptions)
      .map( res => <RepositoryInterface>res.json())
      .catch(this.handleError);
  }

  updateInterface(interfaceInfo: RepositoryInterface): Observable<string> {
    let url = `${this.apiUrl}updateInterface`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(interfaceInfo)}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,interfaceInfo,httpOptions)
      .map( res => res.status.toString())
      .catch(this.handleError);
  }

  deleteInterface(id: string): Observable<string> {
    let url = `${this.apiUrl}deleteInterface/${id}`;
    console.log(`knocking on: ${url}`);
    httpOptions.withCredentials = true;
    return this.http.delete(url,httpOptions)
      .map( res => res.status.toString() )
      .catch(this.handleError);
  }

  addRepository(datatype: string, newRepository: Repository): Observable<Repository> {
    let url = `${this.apiUrl}addRepository?datatype=${datatype}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newRepository)}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,newRepository,httpOptions)
      .map( res => <Repository>res.json())
      .catch(this.handleError);
  }

  updateRepository(repoInfo: Repository): Observable<string> {
    let url = `${this.apiUrl}updateRepository`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(repoInfo)}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,repoInfo,httpOptions)
      .map( res => res.status.toString())
      .catch(this.handleError);
  }

  getRepositoriesOfCountry(country: string, mode: string): Observable<Repository[]> {
    let url = `${this.apiUrl}getRepositoriesByCountry/${country}/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository[]>res.json())
      .catch(this.handleError);
  }

  getRepositoriesOfUser(userEmail: string): Observable<Repository[]> {
    let url = `${this.apiUrl}getRepositoriesOfUser/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository[]>res.json())
      .do(res => console.log(`counted ${res.length} repositories`))
      .catch(this.handleError);
  }


  getRepositoryById(id: string): Observable<Repository> {
    let url = `${this.apiUrl}getRepositoryById/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Repository>res.json())
      .do(res => console.log(`got repository with name: ${res.officialName}`))
      .catch(this.handleError);
  }

  getRepositoryInterface(id: string): Observable<RepositoryInterface[]>{
    let url = `${this.apiUrl}getRepositoryInterface/${id}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <RepositoryInterface[]>res.json())
      .catch(this.handleError);
  }

  getUrlsOfUserRepos(userEmail: string): Observable<string[]>{
    let url = `${this.apiUrl}getUrlsOfUserRepos/${userEmail}/0/100/`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <string[]>res.json())
      .catch(this.handleError);
  }

  getTimezones(): Observable<Timezone[]>{
    let url = `${this.apiUrl}getTimezones`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Timezone[]>res.json())
      .catch(this.handleError);
  }

  getTypologies(): Observable<string[]>{
    let url = `${this.apiUrl}getTypologies`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <string[]>res.json())
      .catch(this.handleError);
  }

  getCountries(): Observable<Country[]> {
    let url = `${this.apiUrl}getCountries`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Country[]>res.json())
      .catch(this.handleError);
  }


  getCompatibilityClasses (mode: string): Observable<Map<string,string>> {
    let url = `${this.apiUrl}getCompatibilityClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,string>>res.json())
      .catch(this.handleError);
  }

  getDatasourceClasses(mode: string): Observable<Map<string,string>>{
    let url = `${this.apiUrl}getDatasourceClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,string>>res.json())
      .catch(this.handleError);
  }


  getMetricsInfoForRepository (repoId: string): Observable<MetricsInfo> {
    let url = `${this.apiUrl}getMetricsInfoForRepository/${repoId}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <MetricsInfo>res.json())
      .catch(this.handleError);
  }

  updateEnglishName(id: string, englishname: string): Observable<string>{
    let url = `${this.apiUrl}updateEnglishName?id=${id}&officialName=DSpace&englishname=${englishname}`;
    console.log(`knocking on: ${url}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,httpOptions)
      .map( res => {
        console.log(`responded ${res.statusText}`);
        return res.status.toString();
      })
      .catch(this.handleError).share();
  }

  updateLongtitude(id: string, longtitude: string): Observable<string>{
    let url = `${this.apiUrl}updateLongtitude`;
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
    let url = `${this.apiUrl}updateLatitude`;
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
    let url = `${this.apiUrl}updateLogoUrl`;
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
    let url = `${this.apiUrl}updateTimezone`;
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
    console.log('E R R O R !!');
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
