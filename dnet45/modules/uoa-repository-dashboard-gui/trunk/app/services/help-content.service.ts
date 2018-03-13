/**
 * Created by stefania on 7/17/17.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Content, PageContent } from "../domain/page-content";


@Injectable()
export class HelpContentService {

  private _helpServiceUrl = process.env.FAQ_ENDPOINT;

  constructor (private http: Http) {
  }

  readonly contents : Content = {
    _id: 'contId',
    page: 'register',
    placement: 'right',
    order: 1,
    content: `
          <h3>Info / Help</h3><p>The OpenAIRE services provide you with an easy way to register your content provider, literature or data repository, OA Journal into the OpenAIRE network. Please join!</p>
          <p>1) Make your repository, CRIS or journal OpenAIRE compatible by implementing the OpenAIRE<a href="https://guidelines.openaire.eu/en/latest/" target="_blank">Guidelines</a>.</p>
          <p>2) After you have made some progress in implementing the guidelines you should run a Compatibility test using the validator tool.</p>
          <p>3) Register your literature repository in OpenDOAR or your data repositoriy in Re3Data (this step does not apply for journals or CRIS).</p>`,
    isActive: true
  };

  readonly pageContent : PageContent = {
    content : {
      right : [this.contents],
      top : [],
      bottom : [],
      left : []
    },
    route : "hello",
    _id : "123",
    name : "123"
  };



  cache : any = {};

  getActivePageContent(route: string) : Observable<PageContent> {
    // if (!this.cache[route]) {
    //   this.cache[route] = this.http.get(this._helpServiceUrl + "/page/route?q=" + route)
    //     .map(res => <PageContent> res.json())
    //     .catch(this.handleError)
    //     .share();
    // }
    // return this.cache[route];
    return Observable.of(this.pageContent).delay(50);
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
