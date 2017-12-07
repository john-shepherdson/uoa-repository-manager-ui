/*
* Created by myrto on 12/05/2017
*/

/*
*  !!! USING TEMPORARY API ADDRESS AND USER
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators'

import {PiwikInfo, Repository} from '../domain/typeScriptClasses';
import {of} from "rxjs/observable/of";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' })
};

@Injectable ()
export class RepositoryService {
  private apiUrl = process.env.API_ENDPOINT;

  constructor(private http: HttpClient){}

  getRepositoriesOfUser (userEmail: string): Observable<PiwikInfo[]> {
    console.log(`knocking on: ${this.apiUrl}/repository/getRepositoriesOfUser/${userEmail}/0/10`);
    return this.http.get<Repository[]>(`${this.apiUrl}/repositories/getRepositoryOfUser/${userEmail}/0/10`)
      .pipe(
        tap( _ => console.log(`got respositories of user with email" ${userEmail}`)),
        map( (rep: Repository) => rep.piwikInfo),
        catchError(this.handleError(`get repositories of user with email: ${userEmail}`))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
