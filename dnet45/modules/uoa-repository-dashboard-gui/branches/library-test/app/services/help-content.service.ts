/**
 * Created by stefania on 7/17/17.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { PageContent } from "../domain/page-content";


@Injectable()
export class HelpContentService {

  private _helpServiceUrl = process.env.FAQ_ENDPOINT;

  constructor (private http: Http) {
  }

  cache : any = {};

  getActivePageContent(route: string) {
    if (!this.cache[route]) {
      this.cache[route] = this.http.get(this._helpServiceUrl + "/page/route?q=" + route)
        .map(res => <PageContent> res.json())
        .catch(this.handleError)
        .share();
    }
    return this.cache[route];
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
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
