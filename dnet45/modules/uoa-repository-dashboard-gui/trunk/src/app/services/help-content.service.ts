/**
 * Created by stefania on 7/17/17.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PageContent } from '../domain/page-content';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class HelpContentService {

  private _helpServiceUrl = environment.FAQ_ENDPOINT;

  constructor (private httpClient: HttpClient) {
  }

  getActivePageContent(route: string) {
    const url = this._helpServiceUrl + '/page/route?q=' + route;
    console.log(`sending request at: ${url}`);

    return this.httpClient.get<PageContent>(url).pipe(catchError(this.handleError));
  }

  private extractData(res: Response) {
    const body = res;
    return body.body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = '';
    console.log(error);
    if (error instanceof Response) {
      const body = error.text() || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
    return throwError(errMsg);
  }
}
