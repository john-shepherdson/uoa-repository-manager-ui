import { Component, OnInit } from '@angular/core';
import { RepositoryService } from "../../services/repository.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { Repository, RepositoryInterface } from "../../domain/typeScriptClasses";
import { formInfoLoading, loadingRepoError } from "../../domain/shared-messages";
import { SharedService } from "../../services/shared.service";

@Component ({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
})

export class RepositoryComponent implements OnInit {

  repositoryId: string;
  repository: Repository;
  repositoryInterfaces: RepositoryInterface[] = [];

  loadingMessage: string = '';
  errorMessage: string = '';

  constructor(private repoService: RepositoryService,
              private sharedService: SharedService,
              private authService: AuthenticationService,
              private route: ActivatedRoute) {

    route.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.repositoryId = this.route.snapshot.paramMap.get('id');
      this.getRepository();
    });
  }

  ngOnInit() {
    // console.log("ngOnit repository component");

  }

  getRepository() {
    this.errorMessage = '';

    if (this.repositoryId) {
      this.loadingMessage = 'Retrieving datasource info';
      this.repoService.getRepositoryById(this.repositoryId).subscribe(
        repository => {
          console.log("Repository component - Repository id: " + repository.id);
          this.sharedService.setRepository(repository);
          this.loadingMessage = '';
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        }
      );

      this.sharedService.repository$.subscribe(r => this.repository = r);
    }
  }

}
