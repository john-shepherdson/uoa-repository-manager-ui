import { Component, OnInit } from '@angular/core';
import { RepositoryService } from "../../services/repository.service";
import { PiwikInfo, Repository } from "../../domain/typeScriptClasses";

@Component ({
  selector: 'app-metrics',
  templateUrl: 'metrics.component.html'
})

export class MetricsComponent implements OnInit {
  reposOfUser: Repository[] = [];
  repos: string[] = [];

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.repos = [
      'NULL',
      'true',
      'false',
      'true',
      'NULL',
      'true',
      'true',
    ];
    this.getReposOfUser();
    if(this.reposOfUser.length) {
      console.log(`counted ${this.reposOfUser.length} repositories`);
    } else {
      console.log('no repos pulled');
    }
  }

  getReposOfUser(): void {
    this.repoService.getRepositoriesOfUser("ant.lebesis@gmail.com")
      .subscribe(repos => this.reposOfUser = repos);
  }

  goToValidationLink(repo: string) {
    if(repo == 'true'){
      return "/home";
    } else if ( repo == 'false' ) {
      return "instructions";
    } else {
      return "enable";
    }
  }
}
