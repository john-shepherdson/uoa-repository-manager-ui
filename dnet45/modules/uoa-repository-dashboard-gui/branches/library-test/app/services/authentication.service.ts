import {Injectable} from "@angular/core";

@Injectable()
export class AuthenticationService {
  isLoggedIn: boolean = false;
  username: string;
  userEmail: string;
  userFullName: string;

  login(){
    this.isLoggedIn = true;
    this.username = 'antleb';
    this.userEmail = 'ant.lebesis@gmail.com';
    this.userFullName = 'Antonis Lempesis';
  }

  logout(){
    this.isLoggedIn = false;
    this.username = '';
    this.userEmail = '';
    this.userFullName = '';
  }

  register(){

  }

  getUserEmail() {
    return this.userEmail;
  }
}
