import { Component, OnInit } from "@angular/core";
import { SharedService } from '../../services/shared.service';
import { RequestsService } from '../gateway-dashboard/services/request.service';
import { RepositorySnippet } from '../../domain/typeScriptClasses';
import { RepositoryService } from "src/app/services/repository.service";
import { takeUntil } from "rxjs/operators";
import { Request } from "../gateway-dashboard/domain/request.domain";
import { ReusableTableComponent } from "src/app/shared/reusable-table/reusable-table.component";
import { NgFor, NgIf } from "@angular/common";


@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReusableTableComponent
  ]
})
export class MyRequestsComponent implements OnInit {
  repositories: RepositorySnippet[] = [];
  loading = false;
  requests: Map<string, Request[]> = new Map();
  foundRequest: boolean = false;

  constructor(private sharedService: SharedService, private requestsService: RequestsService, private repositoryService: RepositoryService) {}

  ngOnInit(): void {
    const repos = this.sharedService.getRepositoriesOfUser();
     console.log("Repositories from sharedService:", repos);
    if (repos && repos.length) {
      this.repositories = repos;
      this.loadRequestsForRepos();
    } else {
      // subscribe to observable if not yet available
      this.loading = true;
      this.repositoryService.getRepositoriesSnippetsOfUser()
      .subscribe(
        repos => {
          this.repositories = repos;
          this.loading = false;
          this.loadRequestsForRepos();
      },
    (err) => {
        console.error('Error loading repositories of user:', err);
        this.loading = false;
      });
    }
  }

  loadRequestsForRepos() {
    let ids = this.repositories.map(repo => repo.id);
    const params: any = {datasourcesIds: ids};
    ids.forEach(id => {
      this.requestsService.getRequestsbyId(id, "datasourceIds").subscribe(
        next => {
          
          this.requests.set(id, next.results);
          if (next.results.length > 0) {
            this.foundRequest = true;
          }
          console.log(this.requests);
        }
      )
    })
  }

}
