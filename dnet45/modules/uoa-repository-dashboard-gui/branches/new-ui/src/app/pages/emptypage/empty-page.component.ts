import { Component, OnInit } from '@angular/core';
import { RepositoryService } from "../../services/repository.service";
import { SharedService } from "../../services/shared.service";
import { RepositorySnippet } from "../../domain/typeScriptClasses";
import { Router } from "@angular/router";

@Component ({
  selector: 'app-empty-page',
  templateUrl: './empty-page.component.html',
})

export class EmptyPageComponent implements OnInit {

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
      // this.getSelectedRepositorySummaryInfo(this.repository);
    } else {
      this.getReposOfUser();
    }

    // this.sharedService.repositoriesOfUser$.subscribe(
    //   r => {
    //     this.repositoriesOfUser = r;
    //   }
    // );

  }

  getReposOfUser(): void {
    this.repositoryService.getRepositoriesOfUser()
      .subscribe(
        repos => {
          this.repositoriesOfUser = repos;
          // this.sharedService.setRepositoriesOfUser(repos);
          if(this.repositoriesOfUser.length>0)
            this.router.navigate([`/repository/${this.repositoriesOfUser[0].id}/dashboard`]);
        },
        error => { console.log(error); }
      );
  }
}
