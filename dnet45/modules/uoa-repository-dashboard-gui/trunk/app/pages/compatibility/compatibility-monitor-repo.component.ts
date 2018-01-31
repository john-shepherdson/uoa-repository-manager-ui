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
  showSpinner: boolean;
  loadingMessage: string;
  errorMessage: string;

  repoId: string = '';
  repo: Repository;

  constructor(private route: ActivatedRoute,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.readRepoId();
    this.getRepo();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
  }

  getRepo(){
    if (this.repoId) {
      this.showSpinner = true;
      this.loadingMessage = loadingRepoMessage;
      this.repoService.getRepositoryById(this.repoId).subscribe(
        repo => this.repo = repo,
        error => console.log(error),
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
          if(!this.repo){
            this.errorMessage = loadingRepoError;
          }
        }
      );
    }
  }
}
