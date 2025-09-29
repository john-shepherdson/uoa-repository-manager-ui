import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Subscription, timer} from 'rxjs';

@Injectable()
export class AuthenticationService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  private loginInterval: Subscription;
  private apiUrl: string = environment.API_ENDPOINT;
  private loginUrl = environment.API_ENDPOINT + '/oauth2/authorization/openaire';

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  public isLoggedIn_ = new BehaviorSubject(false);

  public get isLoggedIn() {
    return this.isLoggedIn_;
  }

  public getLoginUrl(path: string = null): string {
    const continueUrl = window.location.origin + encodeURIComponent(path ? path : this.router.url);
    return `${this.loginUrl}?continue=${continueUrl}`;
  }

  public getLogoutUrl(): string {
    return `${this.apiUrl}/logout`
  }

  public refreshUserInfo() {
    /* SETTING INTERVAL TO REFRESH SESSION TIMEOUT COUNTDOWN */
    if (this.loginInterval == null || this.loginInterval.closed) {
      this.loginInterval = timer(0, 1000 * 60 * 5).subscribe(() => {
        this.http.get(this.apiUrl + '/user/login', {withCredentials: true}).subscribe(
          userInfo => {
            sessionStorage.setItem('name', userInfo['name']);
            sessionStorage.setItem('email', userInfo['email'].trim());
            sessionStorage.setItem('role', userInfo['role']);
            if (!this.isLoggedIn_?.value) {
              this.isLoggedIn_.next(true);
            }
          },
          error => {
            console.debug('/user/login status: ', error.status);
            this.router.navigate(['/home']);
            this.isLoggedIn_.next(false);
            this.loginInterval.unsubscribe();
          },
          () => {
            console.debug(`the current user is: ${sessionStorage.getItem('name')},
                         ${sessionStorage.getItem('email')}, ${sessionStorage.getItem('role')}`);
            if (sessionStorage.getItem('state.location')) {
              const state = sessionStorage.getItem('state.location');
              sessionStorage.removeItem('state.location');
              console.debug(`returning to state: ${state}`);
              this.router.navigate([state]);
            }
          }
        );
      });
    }
  }

  public loginWithState() {
    console.debug(`logging in with state. Current url is: ${this.router.url}`);
    if (this.redirectUrl) {
      const url = this.redirectUrl;
      this.redirectUrl = null;
      sessionStorage.setItem('state.location', url);
    } else if (this.router.url === '/home') {
      /*sessionStorage.setItem("state.location", this.router.url);*/
      sessionStorage.setItem('state.location', '/myDataSources');
    }
    console.debug('redirect location: ', sessionStorage.getItem('state.location'));
    window.location.href = this.getLoginUrl();
  }

  public logout() {
    sessionStorage.clear();
    this.isLoggedIn_.next(false);
    window.location.href = this.getLogoutUrl();
  }

  public tryLogin() {
    this.refreshUserInfo();
    if (this.redirectUrl) {
      const url = this.redirectUrl;
      this.redirectUrl = null;
      this.router.navigate([url]);
      console.debug('Redirecting to: ', url);
    }
  }

  public getIsUserLoggedIn() {
    return this.isLoggedIn_.value && sessionStorage.getItem('email') !== null;
  }

  public getUserName() {
    if (this.getIsUserLoggedIn()) {
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
    if (this.getIsUserLoggedIn()) {
      return sessionStorage.getItem('role');
    } else {
      return '';
    }
  }

}
