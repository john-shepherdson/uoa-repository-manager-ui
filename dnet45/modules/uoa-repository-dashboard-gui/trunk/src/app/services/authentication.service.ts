import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { deleteCookie, getCookie } from '../domain/utils';

@Injectable()
export class AuthenticationService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {}

  private apiUrl: string = environment.API_ENDPOINT;
  private loginUrl = environment.API_ENDPOINT + '/openid_connect_login';

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  private _storage: Storage = localStorage;

  public activateFrontAuthorization: boolean = environment.production;

  isLoggedIn: boolean = false;

  public loginWithState() {
    console.log(`logging in with state. Current url is: ${this.router.url}`);
    if (this.redirectUrl) {
      const url = this.redirectUrl;
      this.redirectUrl = null;
      console.log('stored location', url);
      sessionStorage.setItem('state.location', url);
    } else {
      /*sessionStorage.setItem("state.location", this.router.url);*/
      sessionStorage.setItem('state.location', '/dashboard');
    }
    console.log('redirect location', sessionStorage.getItem('state.location'));
    window.location.href = this.loginUrl;
  }

  public logout() {
    deleteCookie('openAIREUser');
    deleteCookie('AccessToken');
    localStorage.clear();
    sessionStorage.clear();
    this.isLoggedIn = false;

    console.log('logging out, calling:');
    console.log(`${this.apiUrl}/openid_logout`);

    /*window.location.href = `${this.apiUrl}/openid_logout`;*/
    window.location.href = `https://aai.openaire.eu/proxy/saml2/idp/SingleLogoutService.php?ReturnTo=${this.apiUrl}/openid_logout`;
  }

  public tryLogin() {
    if ( getCookie('openAIREUser') && (getCookie('openAIREUser') !== '') ) {
      console.log(`I got the cookie!`);
      console.log(`in tryLogin -> document.cookie is: ${document.cookie.toString()}`);
      /* SETTING INTERVAL TO REFRESH SESSION TIMEOUT COUNTDOWN */
      setInterval(() => {
        this.http.get(this.apiUrl + '/user/login', { withCredentials: true }).subscribe(
          userInfo => {
            console.log('User is still logged in');
            console.log(userInfo);
            this.isLoggedIn = true;
          },
          () => {
            this.logout();
          },
          () => {
            if ( !getCookie('openAIREUser') || (getCookie('openAIREUser') === '') ) {
              this.logout();
            }
          }
        );
        /*this.redirectUrl = window.location.pathname;
        this.loginWithState();*/

      }, 1000 * 60 * 5);
      if (!this.getIsUserLoggedIn()) {
        console.log(`session.name wasn't found --> logging in via repo-service!`);
        this.http.get(this.apiUrl + '/user/login', { withCredentials: true }).subscribe(
          userInfo => {
            console.log(userInfo);
            localStorage.setItem('name', userInfo['name']);
            localStorage.setItem('email', userInfo['email'].trim());
            localStorage.setItem('role', userInfo['role']);
            this.isLoggedIn = true;
            console.log(`the current user is: ${localStorage.getItem('name')},
                         ${localStorage.getItem('email')}, ${localStorage.getItem('role')}`);
          },
          error => {
            localStorage.clear();
            sessionStorage.clear();
            console.log('Error!');
            console.log(error);
            deleteCookie('openAIREUser');
            deleteCookie('AccessToken');
            this.isLoggedIn = false;
            this.router.navigate(['/landing']);
          },
          () => {
            if ( sessionStorage.getItem('state.location') ) {
              const state = sessionStorage.getItem('state.location');
              sessionStorage.clear();
              console.log(`tried to login - returning to state: ${state}`);
              if ( !this.getIsUserLoggedIn() ) {
                console.log('user hasn\'t logged in yet -- going to landing');
                this.router.navigate(['/landing']);
              } else {
                this.router.navigate([state]);
              }
            }
          }
        );
      } else {
        this.isLoggedIn = true;
        console.log(`the current user is: ${localStorage.getItem('name')},
                     ${localStorage.getItem('email')}, ${localStorage.getItem('role')}`);
        if (this.redirectUrl) {
          const url = this.redirectUrl;
          this.redirectUrl = null;
          this.router.navigate([url]);
          console.log('route is', url);
        }
      }
    }
  }

  public getIsUserLoggedIn() {
    this.isLoggedIn = (getCookie('openAIREUser') && (getCookie('openAIREUser') !== '') && (this.getUserEmail() !== '' ) );
    return this.isLoggedIn;
  }

  public getUserName() {
    if (this.isLoggedIn) {
      return localStorage.getItem('name');
    } else {
      return '';
    }
  }

  public getUserEmail() {
    if (this.isLoggedIn) {
      return localStorage.getItem('email');
    } else {
      return '';
    }
  }

  public getUserRole() {
    if (this.isLoggedIn) {
      return localStorage.getItem('role');
    } else {
      return '';
    }
  }

}
