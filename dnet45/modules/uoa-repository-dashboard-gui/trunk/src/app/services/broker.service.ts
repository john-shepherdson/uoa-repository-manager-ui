/*
* Created by myrto on 12/05/2017
*/


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdvQueryObject, BrowseEntry, EventsPage, OpenaireSubscription, SimpleSubscriptionDesc,
         Subscription, Term } from '../domain/typeScriptClasses';
import { Observable } from 'rxjs';

const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
  withCredentials: true
};

@Injectable ()
export class BrokerService {
  private apiUrl = environment.API_ENDPOINT + '/broker/';

  constructor(private httpClient: HttpClient) { }

  advancedShowEvents(page: number, size: number, searchParams: AdvQueryObject): Observable<EventsPage>{
    const url = `${this.apiUrl}advancedShowEvents/${page}/${size}`;
    console.log(`knocking on: ${url}`);
    const body = searchParams;
    console.log(`sending ${JSON.stringify(body)}`);

    return this.httpClient.post<EventsPage>(url, body, headerOptions);
  }

  getDatasourcesOfUser(userEmail: string) {
    const url = `${this.apiUrl}getDatasourcesOfUser?user=${userEmail}&includeShared=false&includeByOthers=false`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get(url, headerOptions);
  }

  getDnetTopics(): Observable<Map<string, Term>> {
    const url = `${this.apiUrl}getDnetTopics`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map< string, Term>>(url, headerOptions);
  }

  getNotificationsBySubscriptionId(subId: string, page: number, size: number): Observable<EventsPage> {
    const url = `${this.apiUrl}getNotificationsBySubscriptionId/${subId}/${page}/${size}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<EventsPage>(url, headerOptions);
  }

  getSimpleSubscriptionsOfUser(userEmail: string): Observable<Map<string, SimpleSubscriptionDesc[]>> {
    const url = `${this.apiUrl}getSimpleSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string, SimpleSubscriptionDesc[]>>(url, headerOptions);
  }

  getSubscription(subId: string): Observable<Subscription> {
    const url = `${this.apiUrl}getSubscription/${subId}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Subscription>(url, headerOptions);
  }

  getSubscriptionsOfUser(userEmail: string): Observable<Map<string, Subscription>> {
    const url = `${this.apiUrl}getSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<Map<string, Subscription>>(url, headerOptions);
  }

  getTopicsForDataSource(name: string): Observable<BrowseEntry[]> {
    const url = `${this.apiUrl}getTopicsForDatasource/${encodeURIComponent(name)}`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.get<BrowseEntry[]>(url, headerOptions);
  }

  /*CHECK IF sub is sent as body*/
  subscribeToEvent(sub: OpenaireSubscription): Observable<Subscription>{
    const url = `${this.apiUrl}subscribe`;
    console.log(`knocking on: ${url}`);

    return this.httpClient.post<Subscription>(url, sub, headerOptions);
  }

  unsubscribe(subscriptionId: string) {
    const url = `${this.apiUrl}unsubscribe/${subscriptionId}`;
    console.log(`knocking on: ${url}`);
    const body = {};

    return this.httpClient.post(url, body, {withCredentials: true, responseType: 'text'});
}

}
