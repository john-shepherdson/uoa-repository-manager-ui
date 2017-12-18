/**
 * Created by myrto on 11/27/17.
 */
import { Component, OnInit } from '@angular/core';
import { RepositoryService } from "../../services/repository.service";
import { PiwikInfo, Repository } from "../../domain/typeScriptClasses";

@Component ({
  selector: 'app-metrics',
  templateUrl: 'metrics.component.html'
})

export class MetricsComponent implements OnInit {
  reposOfUser: Repository[] = [];

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.getReposOfUser();
    console.log(`counted ${this.reposOfUser.length} repositories`);
  }

  getReposOfUser(): void {
    this.repoService.getRepositoriesOfUser("ant.lebesis@gmail.com")
      .subscribe(repos => this.reposOfUser = repos);
  }

  goToValidationLink(piwik: PiwikInfo) {
    if(piwik){
      if(piwik.validated === true){
        return "/home";
      } else if ( piwik.validated === false ) {
        return "instructions";
      }
    } else {
      return "enable";
    }
  }
}
