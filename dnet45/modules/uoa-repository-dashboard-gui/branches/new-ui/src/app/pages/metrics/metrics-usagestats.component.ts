import { Component, OnInit } from '@angular/core';
import { Repository } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'metrics-usagestats',
  templateUrl: 'metrics-usagestats.component.html'
})

export class MetricsUsagestatsComponent implements OnInit {

  errorMessage: string;
  title = 'Get usage statistics report';

  repo: Repository;
  repoId: string;

  constructor(private repoService: RepositoryService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.getRepo();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
  }

  getRepo() {
    this.repoId = this.route.snapshot.paramMap.get('id');

    if (this.repoId) {
      this.repoService.getRepositoryById(this.repoId).subscribe(
        repo => this.repo = repo,
        error => {
          console.log(error);
          this.errorMessage = 'The repository could not be retrieved';
        },
        () => {
          this.title = this.title + ' for ' + this.repo.officialName;
          console.log(this.authService.getUserEmail(), this.repo.registeredBy);
        }
      );
    }
  }

}
