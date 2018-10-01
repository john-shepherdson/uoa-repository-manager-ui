import {Component, OnInit} from "@angular/core";
import {RepositoryService} from "../../services/repository.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Repository} from "../../domain/typeScriptClasses";
import {Observable} from "rxjs/Observable";
import {ReportResponseWrapper} from "../../domain/usageStatsClasses";


@Component({
  selector: 'metrics-usagestats',
  templateUrl: 'metrics-usagestats.component.html'
})

export class MetricsUsagestatsComponent implements OnInit {

  errorMessage: string;
  title: string = 'Get usage statistics report';

  repo: Repository;
  repoId: string;

  constructor(private repoService: RepositoryService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.getRepo();
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
          if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.repo.registeredBy.trim()) ) {
            this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
          }
        }
      );
    }
  }

}
