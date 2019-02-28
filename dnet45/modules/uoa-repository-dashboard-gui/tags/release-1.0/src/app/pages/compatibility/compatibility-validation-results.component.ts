import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobResultEntry, StoredJob } from '../../domain/typeScriptClasses';
import { MonitorService } from '../../services/monitor.service';
import { loadingJobSummary, loadingJobSummaryError, noContentRulesResults,
         noUsageRulesResults } from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-compatibility-validation-results',
  templateUrl: 'compatibility-validation-results.component.html'
})

export class CompatibilityValidationResultsComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
  noRulesTested: string;
  noContent: string;
  noUsage: string;

  jobSummary: StoredJob;
  contentResults: JobResultEntry[] = [];
  usageResults: JobResultEntry[] = [];
  currentErrors: string[] = [];

  modalTitle: string;
  isModalShown: boolean;

  @ViewChild('checkErrors')
  public checkErrors: ConfirmationDialogComponent;

  constructor (private route: ActivatedRoute,
               private router: Router,
               private monitorService: MonitorService,
               private authService: AuthenticationService) {}

  ngOnInit () {
    if (this.authService.getIsUserLoggedIn()) {
      setTimeout(() => {
        this.getJobInfo();
      }, 500 );
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      this.authService.redirectUrl = '/compatibility/browseHistory/' + id;
      this.authService.loginWithState();
    }
  }

  getJobInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadingMessage = loadingJobSummary;
    this.monitorService.getJobSummary(id, 'all').subscribe(
      job => {
        this.jobSummary = job;
        if (this.jobSummary.resultEntries && this.jobSummary.resultEntries.length) {
          this.jobSummary.resultEntries.forEach(
            entry => {
              if (entry.type === 'content') {
                this.contentResults.push(entry);
              } else if (entry.type === 'usage') {
                this.usageResults.push(entry);
              }
            }
          );
        }
      },
      error => {
        console.log(error);
        this.errorMessage = loadingJobSummaryError;
        this.loadingMessage = '';
      },
      () => {
        this.loadingMessage = '';
        if (!this.contentResults.length) {
          this.noContent = noContentRulesResults;
        }
        if (!this.usageResults.length) {
          this.noUsage = noUsageRulesResults;
        }
        /*if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.jobSummary.userEmail.trim()) ) {
          this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
        }*/
      }
    );
  }

  viewErrors(rule: JobResultEntry) {
    this.modalTitle = `Rule: ${rule.name}`;
    this.currentErrors = rule.errors;
    this.checkErrors.showModal();
  }

  linkToError(er: string) {
    return encodeURI(`${this.jobSummary.baseUrl}?verb=GetRecord&metadataPrefix=${this.jobSummary.metadataPrefix}&identifier=${er}`);
  }

}
