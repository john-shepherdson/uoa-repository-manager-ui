/**
 * Created by stefania on 7/17/17.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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
    return this.httpClient.get<PageContent>(url).pipe(catchError(this.handleError));
  }

  private handleError (error: HttpErrorResponse | any) {
    if (error.isErrorState()) {
      console.error(error.message);
      return throwError(error);
    } else {
      console.debug(error.message)
    }
  }
}
