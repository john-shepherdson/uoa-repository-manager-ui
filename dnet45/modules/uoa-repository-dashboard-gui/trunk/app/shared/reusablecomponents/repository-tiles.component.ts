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
  userEmail: string = 'ant.lebesis@gmail.com';

  @Input() title: string = '';

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.getReposOfUser();
    console.log(`counted ${this.reposOfUser.length} repositories`);
  }

  getReposOfUser(): void {
    this.showSpinner = true;
    this.repoService.getRepositoriesOfUser(this.userEmail)
      .subscribe(
        repos => this.reposOfUser = repos,
        error => console.log(error),
        () => {
          this.showSpinner = false;
        }
      );
  }

  goToValidationLink(piwik: PiwikInfo, id: string) {
    if(piwik){
      if(piwik.validated === true){
        return "/home";
      } else if ( piwik.validated === false ) {
        return `/getImpact/instructions/${id}`;
      }
    } else {
      return `/getImpact/enable/${id}`;
    }
  }
}
