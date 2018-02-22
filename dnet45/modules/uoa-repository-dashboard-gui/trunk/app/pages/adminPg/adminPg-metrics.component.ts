import { Component, OnInit, ViewChild } from '@angular/core';
import { PiwikService } from '../../services/piwik.service';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import {
  enabledMetricsError, enablingMetrics, loadingReposMessage,
  reposRetrievalError
} from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';

@Component ({
  selector: 'app-admin-metrics',
  templateUrl: 'adminPg-metrics.component.html'
})

export class AdminPgMetricsComponent implements OnInit {
  piwiks: PiwikInfo[] = [];
  errorMessage: string;
  loadingMessage: string;

  modalTitle = "Approval Confirmation";
  modalButton = "Yes, validate";
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
      .subscribe(
        piwiks => this.piwiks = piwiks.sort( function(a,b){
          if(a.repositoryName<b.repositoryName){
            return -1;
          } else if(a.repositoryName>b.repositoryName){
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
        }
      );
  }

  /*NOT SURE IF THESE PARAMETERS ARE THE CORRECT ONES*/
  confirmApproval(repoId: string) {
    this.confirmApprovalModal.ids = [repoId];
    this.confirmApprovalModal.showModal();
  }

  confirmedApproval(ids: string[]){
    let id = ids[0];
    console.log(`approving validation of piwik for repo with id: ${id}`);
    this.approvePiwik(id);
  }

  approvePiwik(id: string) {
    this.loadingMessage = enablingMetrics;
    this.errorMessage = '';
    this.piwikService.approvePiwikSite(id).subscribe(
      response => console.log(`approvePiwikSite responded: ${response}`),
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = enabledMetricsError;
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
        this.getPiwiks();
      }
    );
  }

}
