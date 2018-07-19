/*
* Created by myrto on 12/05/2017
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {
  AdvQueryObject, BrowseEntry, EventsPage, OpenaireSubscription, Repository, SimpleSubscriptionDesc, Subscription,
  Term
} from '../domain/typeScriptClasses';
import {HttpClient, HttpHeaders} from "@angular/common/http";


let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });
const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class BrokerService {
  private apiUrl = process.env.API_ENDPOINT + '/broker/';

  constructor(private http: Http,
              private httpClient: HttpClient) { }

  advancedShowEvents(page: number,size: number,searchParams: AdvQueryObject): Observable<EventsPage>{
    let url = `${this.apiUrl}advancedShowEvents/${page}/${size}`;
    console.log(`knocking on: ${url}`);
    let body = searchParams;
    console.log(`sending ${JSON.stringify(body)}`);

    return this.httpClient.post<EventsPage>(url,body,headerOptions);
  }

  getDatasourcesOfUser(userEmail: string) {
    let url = `${this.apiUrl}getDatasourcesOfUser?user=${userEmail}&includeShared=false&includeByOthers=false`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get(url,headerOptions);
  }

  getDnetTopics(): Observable<Map<string,Term>> {
    let url = `${this.apiUrl}getDnetTopics`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string,Term>>(url, headerOptions);
  }

  getNotificationsBySubscriptionId(subId: string, page: number, size: number): Observable<EventsPage> {
    let url = `${this.apiUrl}getNotificationsBySubscriptionId/${subId}/${page}/${size}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<EventsPage>(url, headerOptions);
  }

  getSimpleSubscriptionsOfUser(userEmail: string): Observable<Map<string,SimpleSubscriptionDesc[]>> {
    let url = `${this.apiUrl}getSimpleSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string,SimpleSubscriptionDesc[]>>(url, headerOptions);
  }

  getSubscription(subId: string): Observable<Subscription> {
    let url = `${this.apiUrl}getSubscription/${subId}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Subscription>(url,headerOptions);
  }

  getSubscriptionsOfUser(userEmail: string): Observable<Map<string, Subscription>> {
    let url = `${this.apiUrl}getSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string, Subscription>>(url, headerOptions);
  }

  getTopicsForDataSource(name: string): Observable<BrowseEntry[]> {
    let url = `${this.apiUrl}getTopicsForDatasource/${encodeURIComponent(name)}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<BrowseEntry[]>(url, headerOptions);
  }

/* NOT WORKING AND PROBABLY NOT NEEDED
  showEvents(repoName: string, topic: string, page: number): Observable<EventsPage> {
    let url = `${this.apiUrl}showEvents/{datasourceName}/{topic}/{page}?datasourceName=${repoName}&topic=${topic}&page=${page}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<EventsPage>(url, headerOptions);
  }
*/

  /*CHECK IF sub is sent as body*/
  subscribeToEvent(sub: OpenaireSubscription){
    let url = `${this.apiUrl}subscribe`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.post(url,sub,{withCredentials: true, responseType:'text'});
  }

  unsubscribe(subscriptionId: string): Observable<string> {
    let url = `${this.apiUrl}unsubscribe/${subscriptionId}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.post<any>(url,{withCredentials: true, responseType:'text'});
}

}
