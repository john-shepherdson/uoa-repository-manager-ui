import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import { PiwikService } from '../../services/piwik.service';
import { RepositoryService } from '../../services/repository.service';
import { PiwikInfo, Repository } from '../../domain/typeScriptClasses';
import {
  enabledMetricsError, enabledMetricsSuccess, enablingMetrics, loadingRepoError,
  loadingRepoMessage
} from '../../domain/shared-messages';
import { AuthenticationService } from '../../services/authentication.service';

@Component ({
  selector: 'metrics-enable',
  templateUrl: 'metrics-enable.component.html'
})

export class MetricsEnableComponent implements OnInit {
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;

  repo: Repository;
  oaId: string;

  modalTitle = "Confirmation";
  modalButton = "Yes, enable it";
  isModalShown: boolean;

  @ViewChild('confirmEnablingModal')
  public confirmEnablingModal: ConfirmationDialogComponent;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private piwikService: PiwikService,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getRepo();
    this.isModalShown = false;
  }

  getRepo(): void {
    let id = this.route.snapshot.paramMap.get('id');
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
      }
    );
  }

  getOAid () {
    this.piwikService.getOpenaireId(this.repo.id).subscribe(
      id => {
        this.oaId = id;
        console.log(this.oaId);},
      error => console.log(`ERROR is ${error}`)
    );
  }

  confirmEnabling() {
    if (this.repo) {
      this.confirmEnablingModal.showModal();
    }
  }

  confirmedEnabling() {
    if (this.repo) {
      this.loadingMessage = enablingMetrics;
      let piwik: PiwikInfo = {
        repositoryId: this.repo.id,
        openaireId: this.oaId,
        repositoryName: this.repo.officialName,
        country: this.repo.countryName,
        siteId: '',
        authenticationToken: '',
        creationDate: null,
        requestorName: this.authService.userFullName,
        requestorEmail: this.authService.userEmail,
        validated: false,
        validationDate: null,
        comment: ''
      };
      this.piwikService.savePiwikInfo(piwik).subscribe(
        response => {
          console.log(`answered ${response}`);
          this.successMessage = enabledMetricsSuccess;
          this.loadingMessage = '';
        },
        error => {
          console.log(error);
          this.errorMessage = enabledMetricsError;
          this.loadingMessage = '';
          this.getRepo();
        }
      );
    }
  }
}
