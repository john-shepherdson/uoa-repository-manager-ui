import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import { PiwikService } from '../../services/piwik.service';
import { RepositoryService } from '../../services/repository.service';
import { PiwikInfo, Repository } from '../../domain/typeScriptClasses';
import { enabledMetricsError, enabledMetricsSuccess, enablingMetrics,
         loadingRepoError, loadingRepoMessage } from '../../domain/shared-messages';
import { AuthenticationService } from '../../services/authentication.service';

@Component ({
  selector: 'metrics-enable',
  templateUrl: 'metrics-enable.component.html'
})

export class MetricsEnableComponent implements OnInit {
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;

  readonly analyticsUrl = 'https://analytics.openaire.eu/addsite.php?';
  readonly authenticationToken = '32846584f571be9b57488bf4088f30ea';  /* THE ACTUAL TOKEN WILL BE NEEDED EVENTUALLY!! */
  repo: Repository;
  oaId: string;

  modalTitle = 'Confirmation';
  modalButton = 'Yes, enable it';
  isModalShown: boolean;

  @ViewChild('confirmEnablingModal')
  public confirmEnablingModal: ConfirmationDialogComponent;


  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private piwikService: PiwikService,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getRepo();
    this.isModalShown = false;
  }

  getRepo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadingMessage = loadingRepoMessage;
    this.repoService.getRepositoryById(id).subscribe(
      repo => {
        this.repo = repo;
      },
      error => {
        console.log(error);
        this.errorMessage = loadingRepoError;
        this.loadingMessage = '';
      }, () => {
        if (this.repo) {
          this.getOAid();
        }
        this.loadingMessage = '';
        if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.repo.registeredBy.trim()) ) {
          this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
        }
      }
    );
  }

  getOAid () {
    this.piwikService.getOpenaireId(this.repo.id).subscribe(
      id => {
        this.oaId = id;
        console.log(`getOpenaireId responded: ${this.oaId}`);
      },
      error => console.log(`ERROR is ${error}`)
    );
  }

  confirmEnabling() {
    if (this.repo) {
      this.confirmEnablingModal.showModal();
    }
  }

  confirmedEnabling(event: any) {
    if (this.repo) {
      this.loadingMessage = enablingMetrics;
      const piwik: PiwikInfo = {
        repositoryId: this.repo.id,
        openaireId: this.oaId,
        repositoryName: this.repo.officialName,
        country: this.repo.countryName,
        siteId: '',
        authenticationToken: this.authenticationToken,
        creationDate: null,
        requestorName: this.authService.getUserName(),
        requestorEmail: this.authService.getUserEmail(),
        validated: false,
        validationDate: null,
        comment: ''
      };

      this.piwikService.enableMetricsForRepository(this.repo.officialName, this.repo.websiteUrl, piwik).subscribe(
        response => {
          console.log(`enableMetrics answered: ${response}`);
          this.successMessage = enabledMetricsSuccess;
          this.loadingMessage = '';
        },
        error => {
          console.log(error);
          this.errorMessage = enabledMetricsError;
          this.loadingMessage = '';
        },
        () => {
          this.router.navigate([`/getImpact/instructions/${this.repo.id}`]);
        }
      );
    }
  }
}
