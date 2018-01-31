import { Component, Input, OnInit } from '@angular/core';
import { Repository } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { AuthenticationService } from '../../services/authentication.service';
import { loadingReposMessage, loadingUserRepoInfoEmpty, reposRetrievalError } from '../../domain/shared-messages';

@Component ({
  selector: 'repository-tiles',
  templateUrl: 'repository-tiles.component.html'
})

export class RepositoryTilesComponent implements OnInit {
  reposOfUser: Repository[] = [];
  showSpinner: boolean;
  tilesView: boolean;
  errorMessage: string;
  loadingMessage: string;

  @Input() parent: string = '';

  constructor(private authService: AuthenticationService,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.getReposOfUser();
    this.tilesView = true;
  }

  getReposOfUser(): void {
    this.showSpinner = true;
    this.loadingMessage = loadingReposMessage;
    this.repoService.getRepositoriesOfUser(this.authService.getUserEmail())
      .subscribe(
        repos => this.reposOfUser = repos.sort( function(a,b){
          if(a.officialName<b.officialName){
            return -1;
          } else if(a.officialName>b.officialName){
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          console.log(error);
          this.showSpinner = false;
          this.loadingMessage = '';
          this.errorMessage = reposRetrievalError;
          },
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
          if (!this.reposOfUser.length) {
            this.errorMessage = loadingUserRepoInfoEmpty;
          }
        }
      );
  }

  getLinkToNext(repo: Repository): string {
    if (this.parent == 'metrics') {
      if (repo.piwikInfo) {
        if (repo.piwikInfo.validated === true) {
          return `show_metrics/${repo.id}`;
        } else if (repo.piwikInfo.validated === false) {
          return `instructions/${repo.id}`;
        }
      } else {
        return `enable/${repo.id}`;
      }
    } else if(this.parent == 'sourcesUpdate' || this.parent == 'compatibilityMonitor'){
      return repo.id;
    } else if(this.parent == 'contentEvents') {
      return repo.officialName;
    }
  }

  getBadgeCSS(repo: Repository): string {
    if (this.parent == 'metrics') {
      if (repo.piwikInfo) {
        if (repo.piwikInfo.validated === true) {
          return 'uk-badge uk-badge-success';
        } else if (repo.piwikInfo.validated === false) {
          return 'uk-badge uk-badge-warning';
        }
      } else {
        return 'uk-badge uk-badge-danger';
      }
    } else if(this.parent=='contentEvents'){
      return 'el-meta uk-margin uk-text-meta';
    }
  }

  getBadgeText(repo: Repository): string {
    if(this.parent=='metrics'){
      if(repo.piwikInfo){
        if(repo.piwikInfo.validated === true){
          return 'enabled';
        } else if ( repo.piwikInfo.validated === false ) {
          return 'enabling in progress';
        }
      } else {
        return 'not enabled';
      }

    } else if(this.parent=='contentEvents') {
      return this.getRepoEvents(repo);
    }
  }

  getRepoEvents(repo: Repository): string {
    return '0';
  }

  showTiles(){
    this.tilesView = true;
  }

  showList(){
    this.tilesView = false;
  }
}
