import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { apiUrl, appBaseUrl } from '../domain/tempAPI';
import { deleteCookie, getCookie } from '../domain/utils';
import { Http } from '@angular/http';

@Injectable()
export class AuthenticationService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: Http) {}

  /*private apiUrl : string = apiUrl;*/
  /*private loginUrl : string = `${this.apiUrl}/openid_connect_login`;*/

  private apiUrl : string = process.env.API_ENDPOINT;
  private loginUrl: string = process.env.AAI_ENDPOINT;
  private baseUrl: string = process.env.WORKFLOW_API_ENDPOINT;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  private _storage: Storage = sessionStorage;


  isLoggedIn: boolean = false;

  public loginWithState() {
    console.log(`logging in with state. Current url is: ${this.router.url}`);
    sessionStorage.setItem("state.location", this.router.url);
    window.location.href = this.loginUrl;
  }

  public logout(){
    deleteCookie('currentUser');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    this.isLoggedIn = false;

    console.log('logging out, going to:');
    console.log(`https://aai.openaire.eu/proxy/saml2/idp/SingleLogoutService.php?ReturnTo=${this.baseUrl}/landing`);
    window.location.href = `https://aai.openaire.eu/proxy/saml2/idp/SingleLogoutService.php?ReturnTo=${this.baseUrl}/landing`;
  }

  public tryLogin() {
    if(getCookie('currentUser')) {
      console.log(`I got the cookie!`);
      /* SETTING INTERVAL TO REFRESH SESSION TIMEOUT COUNTD */
      setInterval(() => {
        this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
          userInfo => {
            console.log("User is still logged in");
            console.log(userInfo.json());
            this.isLoggedIn = true;
          },
          () => {
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('role');
            deleteCookie('currentUser');
            this.isLoggedIn = false;
          }
        );
      },1000 * 60 * 5);
      if(!sessionStorage.getItem('name')) {
        console.log(`session.name wasn't found --> logging in via repo-service!`);
        this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
          userInfo => {
            console.log(userInfo.json());
            sessionStorage.setItem('name',userInfo.json()['name']);
            sessionStorage.setItem('email',userInfo.json()['email']);
            sessionStorage.setItem('role',userInfo.json()['role']);
            this.isLoggedIn = true;
          },
          () => {
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('role');
            deleteCookie('currentUser');
            this.isLoggedIn = false;
          }
        );
      } else { this.isLoggedIn = true; }
      console.log(`the current user is: ${sessionStorage.getItem('name')}, ${sessionStorage.getItem('email')}, ${sessionStorage.getItem('role')}`);
      if ( sessionStorage.getItem("state.location") ) {
        let state = sessionStorage.getItem("state.location");
        sessionStorage.removeItem("state.location");
        console.log(`tried to login - returning to state: ${state}`);
        if (state.includes('landing')) {
          this.router.navigate([this.redirectUrl]);
        } else {
          this.router.navigate([state]);
        }
      }
    }
  }

  public getIsUserLoggedIn() {
    return this.isLoggedIn;
  }

  public getUserName() {
    if (this.isLoggedIn)
      return sessionStorage.getItem('name');
  }

  public getUserEmail() {
    if (this.isLoggedIn)
      return sessionStorage.getItem('email');
  }

  public getUserRole() {
    if (this.isLoggedIn)
      return sessionStorage.getItem('role');
  }

}
