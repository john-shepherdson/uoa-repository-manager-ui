import {Component, OnInit} from '@angular/core';
import {RepositoryService} from "../../services/repository.service";
import {PiwikInfo} from "../../domain/typeScriptClasses";

@Component ({
  selector: 'app-metrics',
  templateUrl: 'metrics.component.html'
})

export class MetricsComponent implements OnInit {
  reposOfUser: PiwikInfo[];

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.getReposOfUser();
    if(this.reposOfUser) {
      console.log(`counted ${this.reposOfUser.length} repositories`);
    } else {
      console.log('no repos pulled');
    }
  }

  getReposOfUser(): void {
    this.repoService.getRepositoriesOfUser("ant.lebesis@gmail.com")
      .subscribe(repos => this.reposOfUser = repos);
  }
}
