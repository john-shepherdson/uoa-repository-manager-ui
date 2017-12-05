import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable ()
export class RepositoryService {
  private apiUrl = process.env.API_ENDPOINT;

  constructor(private http: HttpClient){}

  getRepositoriesOfUser(userEmail: string) : Observable<string[]> {
    return this.http.get(`${this.apiUrl}/users/${userEmail}`)
      .pipe(
      console.log(`accessing repositories of user with email ${userEmail}`)
    );
  }
}
