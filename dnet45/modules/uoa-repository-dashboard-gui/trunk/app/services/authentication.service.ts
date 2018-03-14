import {Injectable} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { apiUrl, loginUrl } from '../domain/tempAPI';
import { deleteCookie, getCookie } from '../domain/utils';
import { Http } from '@angular/http';
import { User } from '../domain/typeScriptClasses';
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class AuthenticationService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: Http,
              private _cookie: CookieService) {}

  private loginUrl : string = loginUrl;
  private apiUrl : string = apiUrl;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  private _storage: Storage = sessionStorage;


  isLoggedIn: boolean = false;
  userEmail: string;
  userFullName: string;
  userRole: string;

  public loginWithState() {
    console.log(`logging in with state. Current url is: ${this.router.url}`);
    sessionStorage.setItem("state.location",this.router.url);
    window.location.href = this.loginUrl;
  }

  login(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedIn = true;
    this.userEmail = localStorage.getItem('email');
    this.userFullName = localStorage.getItem('name');
    this.userRole = localStorage.getItem('role');
  }

  logout(){
    deleteCookie('currentUser');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    this.router.navigate(['/home']);
  }

  public tryLogin() {

    if(getCookie('currentUser')) {
      console.log(`I got the cookie!`);
      this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
        userInfo => {console.log("User is still logged in")},
        () => {sessionStorage.removeItem('name');sessionStorage.removeItem('email');deleteCookie('name');sessionStorage.removeItem('role');},
        () => {
          if(!sessionStorage.getItem('name')) {
            console.log(`session.name wasn't found --> logging in via repo-service!`);
            this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
              userInfo => {
                console.log(userInfo.json());
                sessionStorage.setItem('name',userInfo.json()['name']);
                sessionStorage.setItem('email',userInfo.json()['email']);
                sessionStorage.setItem('role',userInfo.json()['role']);
              },
              () => {
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('email');
                sessionStorage.removeItem('role');
                deleteCookie('currentUser');
              }, () => {
                this.isLoggedIn = true;
              }
            );
          }
          if(sessionStorage.getItem("state.location")) {
            let state = sessionStorage.getItem("state.location");
            sessionStorage.removeItem("state.location");
            this.router.navigateByUrl(state);
          }
        }
      );
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
