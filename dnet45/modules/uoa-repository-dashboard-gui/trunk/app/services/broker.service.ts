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


let headers = new Headers({ 'Content-Type': 'application/json' });
let httpOptions = new RequestOptions({ headers: headers });

@Injectable ()
export class BrokerService {
  /*private apiUrl = apiUrl + '/broker/';*/
  private apiUrl = process.env.API_ENDPOINT + '/broker/';

  constructor(private http: Http) { }

  advancedShowEvents(page: number,size: number,searchParams: AdvQueryObject): Observable<EventsPage>{
    let url = `${this.apiUrl}advancedShowEvents/${page}/${size}`;
    console.log(`knocking on: ${url}`);
    let body = searchParams;
    console.log(`sending ${JSON.stringify(body)}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,body,httpOptions)
      .map( res => <EventsPage>res.json())
      .catch(this.handleError).share();
  }

  getDatasourcesOfUser(userEmail: string): Observable<Repository[]> {
    let url = `${this.apiUrl}getDatasourcesOfUser?user=${userEmail}&includeShared=true&includeByOthers=true`;
    console.log(`knocking on: ${url}`);

    httpOptions.withCredentials = true;
    return this.http.post(url,httpOptions)
      .map( res => <Repository[]>res.json())
      .catch(this.handleError).share();
  }

  getDnetTopics(): Observable<Map<string,Term>> {
    let url = `${this.apiUrl}getDnetTopics`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,Term>>res.json())
      .catch(this.handleError);
  }

  getNotificationsBySubscriptionId(subId: string, page: number, size: number): Observable<EventsPage> {
    let url = `${this.apiUrl}getNotificationsBySubscriptionId/${subId}/${page}/${size}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <EventsPage>res.json())
      .catch(this.handleError);
  }

  getSimpleSubscriptionsOfUser(userEmail: string): Observable<Map<string,SimpleSubscriptionDesc>> {
    let url = `${this.apiUrl}getSimpleSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,SimpleSubscriptionDesc>>res.json())
      .catch(this.handleError);
  }

  getSubscription(subId: string): Observable<Subscription> {
    let url = `${this.apiUrl}getSubscription/${subId}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Subscription>res.json())
      .catch(this.handleError);
  }

  getSubscriptionsOfUser(userEmail: string): Observable<Map<string, Subscription>> {
    let url = `${this.apiUrl}getSubscriptionsOfUser/${userEmail}/`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <Map<string,Subscription>>res.json())
      .catch(this.handleError);
  }

  getTopicsForDataSource(name: string): Observable<BrowseEntry[]> {
    let url = `${this.apiUrl}getTopicsForDatasource/${name}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <BrowseEntry[]>res.json())
      .catch(this.handleError);
  }

/* NOT WORKING AND PROBABLY NOT NEEDED
  showEvents(repoName: string, topic: string, page: number): Observable<EventsPage> {
    let url = `${this.apiUrl}showEvents/{datasourceName}/{topic}/{page}?datasourceName=${repoName}&topic=${topic}&page=${page}`;
    console.log(`knocking on: ${url}`);
    return this.http.get(url)
      .map( res => <EventsPage>res.json())
      .catch(this.handleError);
  }
*/

  /*CHECK IF sub is sent as body*/
  subscribeToEvent(sub: OpenaireSubscription): Observable<string>{
    let url = `${this.apiUrl}subscribe`;
    console.log(`knocking on: ${url}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,sub,httpOptions)
      .map( res => res.status.toString())
      .catch(this.handleError);
  }

  unsubscribe(subscriptionId: string): Observable<string> {
    let url = `${this.apiUrl}unsubscribe/${subscriptionId}`;
    console.log(`knocking on: ${url}`);
    httpOptions.withCredentials = true;
    return this.http.post(url,httpOptions)
      .map( res => res.status.toString())
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
      console.log(errMsg);
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return Observable.throw(errMsg);
  }

}
