import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {RepositoryService} from '../../services/repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../../services/shared.service';
import {RepositorySnippet} from '../../domain/typeScriptClasses';

@Component({
  selector: 'app-my-data-sources',
  templateUrl: './my-data-sources.component.html',
})

export class MyDataSourcesComponent implements OnInit {

  repositoriesOfUser: RepositorySnippet[] = [];
  loadingMessage: string;
  errorMessage: string;

  constructor(public authService: AuthenticationService,
              private repositoryService: RepositoryService,
              private route: ActivatedRoute,
              private router: Router,
              private sharedService: SharedService) { }

  ngOnInit() {

    this.loadingMessage = 'Retrieving data sources of user..';
    this.errorMessage = '';

    if (this.sharedService.getRepositoriesOfUser() && this.sharedService.getRepositoriesOfUser().length > 0) {
      this.repositoriesOfUser = this.sharedService.getRepositoriesOfUser();
      if (this.repositoriesOfUser.length === 1) {
        this.router.navigate([`/repository/${this.repositoriesOfUser[0].id}/dashboard`]);
      } else {
        this.loadingMessage = null;
      }
    } else {
      this.getReposOfUser();
    }
  }

  getReposOfUser(): void {
    this.repositoryService.getRepositoriesSnippetsOfUser()
      .subscribe(
        repos => {
          this.repositoriesOfUser = repos;
          if (this.repositoriesOfUser.length === 1) {
            this.router.navigate([`/repository/${this.repositoriesOfUser[0].id}/dashboard`]);
          } else {
            this.loadingMessage = null;
          }
        },
        error => { console.log(error); }
      );
  }
}
