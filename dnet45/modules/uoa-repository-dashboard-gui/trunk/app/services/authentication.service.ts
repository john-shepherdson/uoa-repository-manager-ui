import {Injectable} from "@angular/core";

@Injectable()
export class AuthenticationService {
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';

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

  getUserEmail() {
    return this.userEmail;
  }
}
