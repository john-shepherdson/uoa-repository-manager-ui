import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { deleteCookie, getCookie } from '../domain/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthenticationService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {}

  private apiUrl: string = environment.API_ENDPOINT;
  private loginUrl = environment.API_ENDPOINT + '/openid_connect_login';

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  private _storage: Storage = sessionStorage;

  private cookie: string = null;

  public isLoggedIn_ = new BehaviorSubject(false);

  public get isLoggedIn() {
    return this.isLoggedIn_.asObservable();
  }

  public loginWithState() {
    console.log(`logging in with state. Current url is: ${this.router.url}`);
    if (this.redirectUrl) {
      const url = this.redirectUrl;
      this.redirectUrl = null;
      console.log('stored location', url);
      sessionStorage.setItem('state.location', url);
    } else {
      /*sessionStorage.setItem("state.location", this.router.url);*/
      sessionStorage.setItem('state.location', '/join');
    }
    console.log('redirect location', sessionStorage.getItem('state.location'));
    window.location.href = this.loginUrl;
  }

  public logout() {
    deleteCookie('AccessToken');
    sessionStorage.clear();
    this.isLoggedIn_.next(false);
    console.log('logging out, calling:');
    console.log(`${this.apiUrl}/openid_logout`);

    /*window.location.href = `${this.apiUrl}/openid_logout`;*/
    window.location.href = `${environment.AAI_LOGOUT + window.location.origin + this.apiUrl}/openid_logout`;
  }

  public tryLogin() {
    this.cookie = getCookie('AccessToken');
    if (this.cookie && this.cookie !== '') {
      // console.log(`I got the cookie!`);
      // console.log(`in tryLogin -> document.cookie is: ${document.cookie.toString()}`);
      /* SETTING INTERVAL TO REFRESH SESSION TIMEOUT COUNTDOWN */
      setInterval(() => {
        this.http.get(this.apiUrl + '/user/login', { withCredentials: true }).subscribe(
          userInfo => {
            // console.log('User is still logged in');
            // console.log(userInfo);
            this.isLoggedIn_.next(true);
          },
          () => {
            this.logout();
          },
          () => {
            this.cookie = getCookie('AccessToken');
            if ( !this.cookie || this.cookie === '') {
              this.logout();
            }
          }
        );
        /*this.redirectUrl = window.location.pathname;
        this.loginWithState();*/

      }, 1000 * 60 * 5);
      if (!this.getIsUserLoggedIn()) {
        // console.log(`session.name wasn't found --> logging in via repo-service!`);
        this.http.get(this.apiUrl + '/user/login', { withCredentials: true }).subscribe(
          userInfo => {
            // console.log(userInfo);
            sessionStorage.setItem('name', userInfo['name']);
            sessionStorage.setItem('email', userInfo['email'].trim());
            sessionStorage.setItem('role', userInfo['role']);
            this.isLoggedIn_.next(true);
            // console.log(`the current user is: ${sessionStorage.getItem('name')},
            //              ${sessionStorage.getItem('email')}, ${sessionStorage.getItem('role')}`);
          },
          error => {
            sessionStorage.clear();
            console.log('Error!');
            console.log(error);
            deleteCookie('AccessToken');
            deleteCookie('AccessToken');
            this.isLoggedIn_.next(false);
            this.router.navigate(['/home']);
          },
          () => {
            if ( sessionStorage.getItem('state.location') ) {
              const state = sessionStorage.getItem('state.location');
              sessionStorage.removeItem('state.location');
              console.log(`tried to login - returning to state: ${state}`);
              if ( !this.getIsUserLoggedIn() ) {
                // console.log('user hasn\'t logged in yet -- going to home');
                this.router.navigate(['/home']);
              } else {
                this.router.navigate([state]);
              }
            }
          }
        );
      } else {
        this.isLoggedIn_.next(true);
        // console.log(`the current user is: ${sessionStorage.getItem('name')},
        //              ${sessionStorage.getItem('email')}, ${sessionStorage.getItem('role')}`);
        if (this.redirectUrl) {
          const url = this.redirectUrl;
          this.redirectUrl = null;
          this.router.navigate([url]);
          // console.log('route is', url);
        }
      }
    }
  }

  public getIsUserLoggedIn() {
    // todo: probably not all of them are needed
    return this.isLoggedIn_.value && this.cookie && this.cookie !== '' && sessionStorage.getItem('email') !== null;
  }

  public getUserName() {
    if (this.isLoggedIn_.value) {
      return sessionStorage.getItem('name');
    } else {
      return '';
    }
  }

  public getUserEmail() {
    if (this.getIsUserLoggedIn()) {
      return sessionStorage.getItem('email');
    } else {
      return '';
    }
  }

  public getUserRole() {
    if (this.isLoggedIn_.value) {
      return sessionStorage.getItem('role');
    } else {
      return '';
    }
  }

}
