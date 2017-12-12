import {Injectable} from "@angular/core";

@Injectable()
export class AuthenticationService {
  userName: string;
  userEmail: string;
  isLoggedIn: boolean;

  login(){
    this.isLoggedIn = true;
    this.userName = 'Antonis Lempesis';
    this.userEmail = 'ant.lebesis@gmail.com';
  }

  logout(){
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
  }

  register(){

  }
}
