/*
* Created by myrto on 12/05/2017
*/


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {
  AggregationDetails,
  Country,
  MetricsInfo,
  Repository,
  RepositoryInterface,
  RepositorySnippet,
  Timezone,
  Typology
} from '../domain/typeScriptClasses';
import { timezones } from '../domain/timezones';
import { typologies } from '../domain/typologies';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {tap} from "rxjs/operators";

let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
                             .set('Accept', 'application/json'),
  withCredentials: true
};


@Injectable ()
export class RepositoryService {
  private apiUrl = process.env.API_ENDPOINT + '/repository/';

  constructor(private http: Http,
              private httpClient: HttpClient) { }

  addInterface(datatype: string, repoId: string, registeredBy: string, newInterface: RepositoryInterface): Observable<RepositoryInterface> {
    let url = `${this.apiUrl}addInterface?datatype=${datatype}&repoId=${repoId}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newInterface)}`);
    httpOptions.withCredentials = true;
    return this.httpClient.post<RepositoryInterface>(url,newInterface,headerOptions);
  }

  updateInterface(repoId: string, registeredBy: string, interfaceInfo: RepositoryInterface): Observable<RepositoryInterface> {
    let url = `${this.apiUrl}updateRepositoryInterface?repoId=${repoId}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(interfaceInfo)}`);
    httpOptions.withCredentials = true;
    return this.httpClient.post<RepositoryInterface>(url,interfaceInfo,headerOptions);
  }

  deleteInterface(id: string, registeredBy: string) {
    let url = `${this.apiUrl}deleteInterface/?id=${id}&registeredBy=${registeredBy}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.delete(url, {withCredentials: true, responseType:'text'});
  }

  addRepository(datatype: string, newRepository: Repository): Observable<Repository> {
    let url = `${this.apiUrl}addRepository?datatype=${datatype}`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(newRepository)}`);
    return this.httpClient.post<Repository>(url,newRepository,headerOptions);
  }

  updateRepository(repoInfo: Repository): Observable<Repository> {
    let url = `${this.apiUrl}updateRepository`;
    console.log(`knocking on: ${url}`);
    console.log(`sending ${JSON.stringify(repoInfo)}`);
    return this.httpClient.post<Repository>(url,repoInfo,headerOptions);
  }

  getRepositoriesOfCountry(country: string, mode: string): Observable<RepositorySnippet[]> {
    let url = `${this.apiUrl}getRepositoriesByCountry/${country}/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  getRepositoriesOfUser(userEmail: string): Observable<Repository[]> {
    let url = `${this.apiUrl}getRepositoriesOfUser/${userEmail}/0/100`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }


  getRepositoryById(id: string): Observable<Repository> {
    let url = `${this.apiUrl}getRepositoryById/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  getRepositoryInterface(id: string): Observable<RepositoryInterface[]>{
    let url = `${this.apiUrl}getRepositoryInterface/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }


  getUrlsOfUserRepos(userEmail: string): Observable<string[]>{
    let url = `${this.apiUrl}getUrlsOfUserRepos/${userEmail}/0/100/`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  getRepositoryAggregations(id: string): Observable<AggregationDetails[]>{
    let url = `${this.apiUrl}getRepositoryAggregations/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  getRepositoryAggregationsByYear(id: string): Observable<Map<string,AggregationDetails[]>>{
    let url = `${this.apiUrl}getRepositoryAggregationsByYear/${id}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get<Map<string,AggregationDetails[]>>(url, headerOptions);
  }

  getTimezones(): Observable<Timezone[]>{
/*    let url = `${this.apiUrl}getTimezones`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);*/
    return Observable.of(<Timezone[]>timezones);
  }

  getTypologies(): Observable<Typology[]>{
/*    let url = `${this.apiUrl}getTypologies`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);*/
    return Observable.of(<Typology[]>typologies);
  }

  getCountries(): Observable<Country[]> {
    let url = `${this.apiUrl}getCountries`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }


  getCompatibilityClasses (mode: string): Observable<Map<string,string>> {
    let url = `${this.apiUrl}getCompatibilityClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  getDatasourceClasses(mode: string): Observable<Map<string,string>>{
    let url = `${this.apiUrl}getDatasourceClasses/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }


  getMetricsInfoForRepository (repoId: string): Observable<MetricsInfo> {
    let url = `${this.apiUrl}getMetricsInfoForRepository/${repoId}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
  }

  updateEnglishName(id: string, englishname: string) {
    let url = `${this.apiUrl}updateEnglishName?id=${id}&officialName=DSpace&englishname=${englishname}`;
    console.log(`knocking on: ${url}`);
    const body = {};

    return this.httpClient.post(url, body, {withCredentials: true, responseType: 'text'});
  }

  updateLongtitude(id: string, longtitude: string){
    let url = `${this.apiUrl}updateLongtitude`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      logntitude: longtitude
    });
    console.log(`sending ${body}`);

    return this.httpClient.post(url,body, {withCredentials: true, responseType: 'text'});
  }

  updateLatitude(id: string, latitude: string) {
    let url = `${this.apiUrl}updateLatitude`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      latitude: latitude
    });
    console.log(`sending ${body}`);

    return this.httpClient.post(url,body,{withCredentials: true, responseType: 'text'});
  }

  updateLogoUrl(id: string, logoUrl: string) {
    let url = `${this.apiUrl}updateLogoUrl`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      logoUrl: logoUrl
    });
    console.log(`sending ${body}`);

    return this.httpClient.post(url,body,{withCredentials: true, responseType: 'text'});
  }

  updateTimezone(id: string, timezone: string) {
    let url = `${this.apiUrl}updateTimezone`;
    console.log(`knocking on: ${url}`);
    let body = JSON.stringify({
      id : id,
      timezone: timezone
    });
    console.log(`sending ${body}`);

    return this.httpClient.post(url,body,{withCredentials: true, responseType: 'text'});
  }

  getListLatestUpdate(mode: string): Observable<any> {
    let url = `${this.apiUrl}getListLatestUpdate/${mode}`;
    console.log(`knocking on: ${url}`);
    return this.httpClient.get(url, headerOptions);
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
      errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return Observable.throw(errMsg);
  }

}
