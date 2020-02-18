import { Component, OnInit } from '@angular/core';
import { RepositoryService } from "../../services/repository.service";
import { SharedService } from "../../services/shared.service";
import { RepositorySnippet } from "../../domain/typeScriptClasses";
import { Router } from "@angular/router";

@Component ({
  selector: 'app-join',
  templateUrl: './join.component.html',
})

export class JoinComponent implements OnInit {

  repositoriesOfUser: RepositorySnippet[];

  constructor(private repositoryService: RepositoryService,
              private sharedService: SharedService,
              private router: Router) {
  }

  ngOnInit() {

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("landing");
    body.classList.add("dashboard");

    if(this.sharedService.getRepositoriesOfUser() && this.sharedService.getRepositoriesOfUser().length>0) {
      this.repositoriesOfUser = this.sharedService.getRepositoriesOfUser();
      if(this.repositoriesOfUser.length>0)
        this.router.navigate([`/repository/${this.repositoriesOfUser[0].id}/dashboard`]);
    } else {
      this.getReposOfUser();
    }

  }

  getReposOfUser(): void {
    this.repositoryService.getRepositoriesOfUser()
      .subscribe(
        repos => {
          this.repositoriesOfUser = repos;
          if(this.repositoriesOfUser.length>0)
            this.router.navigate([`/repository/${this.repositoriesOfUser[0].id}/dashboard`]);
        },
        error => { console.log(error); }
      );
  }
}
