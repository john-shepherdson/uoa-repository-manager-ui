import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Repository } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { loadingRepoError, loadingRepoMessage } from '../../domain/shared-messages';

@Component ({
  selector: 'app-compatibility-monitor-repo',
  templateUrl: 'compatibility-monitor-repo.component.html'
})

export class CompatibilityMonitorRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  repoId: string = '';
  repoName: string = '';
  repo: Repository;

  constructor(private route: ActivatedRoute,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.readRepoId();
    this.getRepo();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.repoName = `repository with id \'${this.repoId}\'`;
  }

  getRepo(){
    if (this.repoId) {
      this.loadingMessage = loadingRepoMessage;
      this.repoService.getRepositoryById(this.repoId).subscribe(
        repo => {
          this.repo = repo;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        },
        () => {
          this.loadingMessage = '';
          if (this.repo) {
            this.repoName = this.repo.officialName;
          } else {
            this.errorMessage = loadingRepoError;
          }
        }
      );
    }
  }
}
