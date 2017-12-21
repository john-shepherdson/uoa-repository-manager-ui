import { Component, Input, OnInit } from '@angular/core';
import { PiwikInfo, Repository } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';

@Component ({
  selector: 'repository-tiles',
  templateUrl: 'repository-tiles.component.html'
})

export class RepositoryTilesComponent implements OnInit {
  reposOfUser: Repository[] = [];
  showSpinner: boolean;
  layoutChoice: string;
  badgeCSS: string;
  badgeText: string;
  linkToNext: string;
  errorMessage: string = '';

  @Input() parent: string = '';

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.getReposOfUser();
    this.layoutChoice = 'tiles';
  }

  getReposOfUser(): void {
    this.showSpinner = true;
    this.repoService.getRepositoriesOfUser()
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
          this.errorMessage = 'An error occured and the repositories could not be retrieved!';
          },
        () => {
          this.showSpinner = false;
        }
      );
  }

  setPropertiesForRepo(repo: Repository): void {
    if(this.parent=='metrics'){
      this.goToValidationLink(repo.piwikInfo, repo.id);

    } else if(this.parent=='contentEvents'){
      this.badgeCSS = 'el-meta uk-margin uk-text-meta';
      this.badgeText = '0';
      this.linkToNext = `/contact/events/${repo.officialName}`;

    } else if(this.parent=='sourcesUpd') {
      this.linkToNext = '#';
    }
  }

  goToValidationLink(piwik: PiwikInfo, id: string) {
    if(piwik){
      if(piwik.validated === true){
        this.badgeCSS = 'uk-badge uk-badge-success';
        this.badgeText = 'enabled';
        this.linkToNext = `/getImpact/show_metrics/${id}`;

      } else if ( piwik.validated === false ) {
        this.badgeCSS = 'uk-badge uk-badge-warning';
        this.badgeText = 'enabling in progress';
        this.linkToNext = `/getImpact/instructions/${id}`;
      }
    } else {
      this.badgeCSS = 'uk-badge uk-badge-danger';
      this.badgeText = 'not enabled';
      this.linkToNext = `/getImpact/enable/${id}`;
    }
  }

  showTiles(){
    this.layoutChoice = 'tiles';
  }

  showList(){
    this.layoutChoice = 'list';
  }
}
