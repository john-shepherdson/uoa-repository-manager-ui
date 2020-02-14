import { Injectable } from "@angular/core";
import { Repository, RepositorySnippet } from "../domain/typeScriptClasses";
import { Subject } from "rxjs/internal/Subject";

@Injectable()
export class SharedService {

  private repositoryCopy: Repository;
  private repository: Subject<Repository> = new Subject<Repository>();

  private repositoriesOfUserCopy: RepositorySnippet[];
  private repositoriesOfUser: Subject<RepositorySnippet[]> = new Subject<RepositorySnippet[]>();

  get repository$() {
    return this.repository.asObservable();
  }

  getRepository() {
    return this.repositoryCopy;
  }

  setRepository(data:Repository) {
    this.repository.next(data);
    this.repositoryCopy = data;
  }

  get repositoriesOfUser$() {
    return this.repositoriesOfUser.asObservable();
  }

  getRepositoriesOfUser() {
    return this.repositoriesOfUserCopy;
  }

  setRepositoriesOfUser(data: RepositorySnippet[]) {
    // this.repositoriesOfUser.
    this.repositoriesOfUser.next(data);
    this.repositoriesOfUserCopy = data;
  }
}
