import { Component, OnInit, ViewChild } from '@angular/core';
import { PiwikService } from '../../services/piwik.service';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import {
  enabledMetricsError,
  enablingMetrics,
  loadingReposMessage,
  reposRetrievalError,
  validatePiwikSiteSuccess
} from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';

@Component ({
  selector: 'app-admin-metrics',
  templateUrl: 'adminPg-metrics.component.html'
})

export class AdminPgMetricsComponent implements OnInit {
  piwiks: PiwikInfo[] = [];
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  modalTitle = 'Approval Confirmation';
  modalButton = 'Yes, validate';
  isModalShown: boolean;

  @ViewChild('confirmApprovalModal')
  public confirmApprovalModal: ConfirmationDialogComponent;

  constructor(private piwikService: PiwikService) {}

  ngOnInit() {
    this.getPiwiks();
    this.isModalShown = false;
  }


  getPiwiks() {
    this.loadingMessage = loadingReposMessage;
    this.piwikService.getPiwikSitesForRepos()
      .subscribe (
        piwiks => this.piwiks = piwiks.sort( function(a, b) {
          if (a.repositoryName < b.repositoryName) {
            return -1;
          } else if (a.repositoryName > b.repositoryName) {
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = reposRetrievalError;
        },
        () => {
          this.loadingMessage = '';
          window.scroll(1, 1);
        }
      );
  }

  confirmApproval(repoId: string) {
    this.confirmApprovalModal.ids = [repoId];
    this.confirmApprovalModal.showModal();
  }

  confirmedApproval(ids: string[]) {
    const id = ids[0];
    console.log(`approving validation of piwik for repo with id: ${id}`);
    this.approvePiwik(id);
  }

  approvePiwik(id: string) {
    this.loadingMessage = enablingMetrics;
    this.errorMessage = '';
    this.successMessage = '';

    /*this.piwikService.approvePiwikSite(id).subscribe(*/
    this.piwikService.markPiwikSiteAsValidated(id).subscribe(
      response => console.log(`approvePiwikSite responded: ${JSON.stringify(response)}`),
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = enabledMetricsError;
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
        this.successMessage = validatePiwikSiteSuccess;
        this.getPiwiks();
      }
    );
  }

}
