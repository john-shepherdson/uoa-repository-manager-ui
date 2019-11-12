/**
 * Created by stefania on 7/5/16.
 */
import { Component, DoCheck, OnInit, ViewEncapsulation} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import {FormGroup} from "@angular/forms";
import {Repository} from '../../domain/typeScriptClasses';
import {loadingReposMessage, loadingUserRepoInfoEmpty, reposRetrievalError} from '../../domain/shared-messages';
import {RepositoryService} from '../../services/repository.service';

@Component({
  selector: 'side-menu',
  templateUrl: './sidemenu.component.html',
  // styleUrls: ['./sidemenu.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SideMenuComponent implements OnInit {
  userLoggedIn = false;
  userName = '';
  isUserAdmin = false;
  adminHomePage = environment.FAQ_HOMEPAGE;

  inBeta: boolean;

  toggle: number[] = [];

  userEmail: string;
  reposOfUser: Repository[] = [];
  private skipGridView = false;

  constructor(public authService: AuthenticationService,
              private repositoryService: RepositoryService) { }

  ngOnInit() {

    const pathName = window.location.pathname;
    if (pathName.includes('sources')) {
      this.toggle[1] = 1;
    } else if (pathName.includes('compatibility')) {
      this.toggle[2] = 2;
    } else if (pathName.includes('content')) {
      this.toggle[3] = 3;
    } else if (pathName.includes('admin')) {
      this.toggle[4] = 4;
    }

    this.getIsUserLoggedIn();
    this.getUserName();
    this.getIsUserAdmin();

    const baseUrl = window.location.origin;
    this.inBeta = ( baseUrl.includes('beta') || baseUrl.includes('athenarc') );

    this.getReposOfUser();
  }

  onClick(id: string) {
    const el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }


  login() {
    this.authService.loginWithState();
  }

  logout() {
    this.authService.logout();
  }


  getUserName() {
    this.userName = this.authService.getUserName();
    return this.userName;
  }

  getIsUserLoggedIn() {
    this.userLoggedIn = this.authService.getIsUserLoggedIn();
    return this.userLoggedIn;
  }

  getIsUserAdmin() {
    this.isUserAdmin = (this.authService.getUserRole().includes('ROLE_ADMIN') ||
      this.authService.getUserRole().includes('ROLE_PROVIDE_ADMIN'));
    return this.isUserAdmin;
  }

  setToggle(position: number) {
    if (this.toggle[position] === position) {
      this.toggle[position] = 0;
    } else {
      this.toggle[position] = position;
    }
  }

  checkIfCollapsed(position: number) {
    return this.toggle[position] === position;
  }

  getReposOfUser(): void {
    this.repositoryService.getRepositoriesOfUser(this.authService.getUserEmail())
      .subscribe(
        repos => { this.reposOfUser = repos; },
        error => { console.log(error); },
        () => { if (this.reposOfUser.length == 1) { this.skipGridView = true; } }
      );
  }
}
