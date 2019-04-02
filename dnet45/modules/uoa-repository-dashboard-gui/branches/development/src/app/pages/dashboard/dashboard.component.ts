import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RepositoryService } from '../../services/repository.service';
import {Repository} from '../../domain/typeScriptClasses';

@Component ({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private repositoryService: RepositoryService) { }

  repositories: Repository[] = [];
  userEmail: string;

  ngOnInit() {
    // this.getUserEmail();
    this.userEmail = sessionStorage.getItem('email');
    if (this.userEmail) {
      this.getRepositoriesOfUser(this.userEmail);
    }
  }

  getIsUserLoggedIn() {
    return this.authService.getIsUserLoggedIn();
  }

  getUserEmail() {
    this.userEmail = this.authService.getUserEmail();
  }

  getRepos() {
    console.log('in getRepos');
    this.getRepositoriesOfUser(this.userEmail);
  }

  getRepositoriesOfUser(userEmail: string) {
    this.repositoryService.getRepositoriesOfUser(userEmail).subscribe(
      repositories => this.repositories = repositories,
      error => console.log('Errrrror'),
      () => console.log(this.repositories)
    );
  }
}
