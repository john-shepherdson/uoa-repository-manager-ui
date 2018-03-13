import {Injectable} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { apiUrl, loginUrl } from '../domain/tempAPI';
import { deleteCookie, getCookie } from '../domain/utils';
import { Http } from '@angular/http';
import { User } from '../domain/typeScriptClasses';

@Injectable()
export class AuthenticationService {

  constructor(private route: ActivatedRoute, private router: Router, private http: Http) {}

  private loginUrl : string = loginUrl;
  private apiUrl : string = apiUrl;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private _storage: Storage = sessionStorage;


  isLoggedIn: boolean = false;
  userEmail: string;
  userFullName: string;
  userRole: string;

  public loginWithState() {
    console.log(this.route);
    sessionStorage.setItem("state.location",this.router.url);
    window.location.href =this.loginUrl;
  }

  public getLoggedInUser() : string {
    console.log(sessionStorage.getItem('name'));
    return sessionStorage.getItem('name');
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
/*    sessionStorage.removeItem('user');*/
    window.location.href = `/`;
    this.isLoggedIn = false;
    this.userRole = '';
    this.userEmail = '';
    this.userFullName = '';
  }

  public tryLogin() {
    if(getCookie('currentUser')) {
      setInterval(() =>{
        this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
          userInfo => {console.log("User is still logged in")},
          () => {sessionStorage.removeItem('name');sessionStorage.removeItem('email');deleteCookie('name');sessionStorage.removeItem('role');}
        );
      },1000 * 60 * 5);
      if(!sessionStorage.getItem('name')) {
        this.http.get(this.apiUrl + '/user/login',{ withCredentials: true }).subscribe(
          userInfo => {
            console.log(userInfo.json());
            sessionStorage.setItem('name',userInfo.json()['name']);
            sessionStorage.setItem('email',userInfo.json()['email']);
            sessionStorage.setItem('role',userInfo.json()['role']);
          },
          () => {sessionStorage.removeItem('name');sessionStorage.removeItem('email');deleteCookie('name');sessionStorage.removeItem('role');}
        );
      }
      if(sessionStorage.getItem("state.location")) {
        let state = sessionStorage.getItem("state.location");
        sessionStorage.removeItem("state.location");
        this.router.navigateByUrl(state);
      }
    }
  }



    getUserEmail() {
    return this.userEmail;
  }
}
