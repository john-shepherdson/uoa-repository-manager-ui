/**
 * Created by stefania on 7/5/16.
 */
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import {Repository, RepositorySnippet} from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'side-menu',
  templateUrl: './sidemenu.component.html',
})

export class SideMenuComponent implements OnInit {
  userLoggedIn = false;
  userName = '';
  isUserAdmin = false;
  adminHomePage = environment.FAQ_HOMEPAGE;

  inBeta: boolean;

  toggle: number[] = [];

  userEmail: string;
  reposOfUser: RepositorySnippet[] = [];
  visibleReposOfUser: RepositorySnippet[] = [];
  allReposVisible: boolean = false;

  visibleAdminRepo: boolean = false;
  adminRepository: Repository;

  constructor(public authService: AuthenticationService,
              private repositoryService: RepositoryService,
              private route: ActivatedRoute,
              private router: Router,
              private sharedService: SharedService) { }

  ngOnInit() {

    // this.router.events.subscribe((val) => {
    //
    //   console.log("*******************  Router changed to: " + this.router.url);
    //
    //   let route = this.router.url;
    //   let repositoryID = '';
    //   let index: number = 0;
    //
    //   if(route.includes('repository') || route.includes('repositoryAdmin')) {
    //     let repositoryIndex = route.indexOf('repository');
    //     repositoryID = route.substr(repositoryIndex).split('/')[1];
    //
    //     if(!route.includes('repositoryAdmin')) {
    //       this.visibleAdminRepo = false;
    //       index = this.reposOfUser.findIndex(x => x.id === repositoryID);
    //       if(index>5)
    //         this.showMoreRepos();
    //     }
    //
    //     if(route.includes('repositoryAdmin')) {
    //       //fixme make it work with the subject below
    //       this.repositoryService.getRepositoryById(repositoryID).subscribe(
    //         r => {
    //           this.adminRepository = r;
    //           this.visibleAdminRepo = true;
    //         },error => { console.log(error); }
    //       );
    //     }
    //   } else {
    //     this.visibleAdminRepo = false;
    //   }
    //
    //   console.log("******************  this.visibleAdminRepo: " + this.visibleAdminRepo);
    // });

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

    if(this.sharedService.getRepositoriesOfUser() && this.sharedService.getRepositoriesOfUser().length>0) {
      this.reposOfUser = this.sharedService.getRepositoriesOfUser();
      this.initSideMenuRepos();
    } else {
      this.getReposOfUser();
    }

    this.sharedService.repositoriesOfUser$.subscribe(
      r => {
        this.reposOfUser = r;
        this.initSideMenuRepos();
      }
    );

    // this.getReposOfUser();
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
    this.repositoryService.getRepositoriesOfUser()
      .subscribe(
        repos => {
            this.reposOfUser = repos;
            // this.sharedService.setRepositoriesOfUser(repos);
            this.initSideMenuRepos();
          },
        error => { console.log(error); }
      );
  }

  initSideMenuRepos() {

    if(this.reposOfUser.length>5) {
      for(let _i = 0; _i < 5; _i++) {
        this.visibleReposOfUser.push(this.reposOfUser[_i]);
      }
    } else {
      this.visibleReposOfUser = Object.assign([], this.reposOfUser);
    }

    let route = this.router.url;
    let repositoryID = '';
    let index: number = 0;
    if(route.includes('repository')) {

      console.log('************* route: '+ route);
      let repositoryIndex = route.indexOf('repository');
      repositoryID = route.substr(repositoryIndex).split('/')[1];

      console.log('************* repositoryID: '+ repositoryID);

      if(!route.includes('repositoryAdmin')) {
        this.visibleAdminRepo = false;
        index = this.reposOfUser.findIndex(x => x.id === repositoryID);
        console.log('************* index: '+ index);
        if (index > 5)
          this.showMoreRepos();
      }
    }

    // let repository: Repository;
    // this.sharedService.repository$.subscribe(
    //   r => {
    //     repository = r;
    //     console.log("************ initSideMenu got repo from subject *****************")
    //     // console.log("RepositoryID: ", this.repository.id);
    //   }
    // );
    //
    // if(this.sharedService.getRepository()) {
    //   repository = this.sharedService.getRepository();
    //   console.log("************ initSideMenu got repo from copy *****************")
    // }



  }

  showMoreRepos() {
    console.log('************* show more repos');
    this.visibleReposOfUser = Object.assign([], this.reposOfUser);
    this.allReposVisible = true;
  }

  showLessRepos() {
    this.visibleReposOfUser = [];
    for(let _i = 0; _i < 5; _i++) {
      this.visibleReposOfUser.push(this.reposOfUser[_i]);
    }
    this.allReposVisible = false;
  }
}
