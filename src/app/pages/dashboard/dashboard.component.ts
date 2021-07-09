import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RepositoryService } from '../../services/repository.service';
import {Repository, RepositorySnippet, RepositorySummaryInfo} from '../../domain/typeScriptClasses';

@Component ({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private repositoryService: RepositoryService) { }

  repositories: RepositorySummaryInfo[] = [];
  userEmail: string;

  loading: boolean = true;

  ngOnInit() {
    // this.getUserEmail();
    this.userEmail = sessionStorage.getItem('email');
    if (this.userEmail) {
      this.getRepositoriesSummaryInfo();
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
    this.getRepositoriesSummaryInfo();
  }

  getRepositoriesSummaryInfo() {
    this.repositoryService.getRepositoriesSummaryInfo().subscribe(
      repositories => { this.repositories = repositories; this.loading=false },
      error => { console.log('Errrrror'); this.loading=false },
      () => { console.log(this.repositories); this.loading=false }
    );
  }
}
