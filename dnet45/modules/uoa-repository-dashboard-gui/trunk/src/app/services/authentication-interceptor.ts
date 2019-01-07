import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
          tap( (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
              },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    console.log(err);
                    if (err.status === 403) {
                        console.log('Unauthorised!!', err);
                        this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
                    } else {
                        this.handleError(err);
                    }
                }
            }
          )
        );
    }

    /*handleError function as provided by angular.io (copied on 22/10/2018)*/
    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }
}
