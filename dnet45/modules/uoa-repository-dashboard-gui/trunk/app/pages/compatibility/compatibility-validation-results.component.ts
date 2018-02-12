import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobResultEntry, StoredJob } from '../../domain/typeScriptClasses';
import { MonitorService } from '../../services/monitor.service';
import {
  loadingJobSummary, loadingJobSummaryError, noContentRulesResults,
  noUsageRulesResults
} from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';

@Component({
  selector: 'app-compatibility-validation-results',
  templateUrl: 'compatibility-validation-results.component.html'
})

export class CompatibilityValidationResultsComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
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
               private monitorService: MonitorService) {}

  ngOnInit () {
    setTimeout(() => {
      this.getJobInfo();
    }, 500 );
  }

  getJobInfo() {
    let id = this.route.snapshot.paramMap.get('id');
    this.loadingMessage = loadingJobSummary;
    this.monitorService.getJobSummary(id,'all').subscribe(
      job => {
        this.jobSummary = job;
        if (this.jobSummary.resultEntries.length) {
          this.jobSummary.resultEntries.forEach(
            entry => {
              if (entry.type == 'content') {
                this.contentResults.push(entry);
              } else if (entry.type == 'usage') {
                this.usageResults.push(entry);
              }
            }
          );
        }
      },
      error => {
        console.log(error);
        this.errorMessage = loadingJobSummaryError;
      },
      () => {
        this.loadingMessage = '';
        if (!this.contentResults.length) {
          this.noContent = noContentRulesResults;
        }
        if (!this.usageResults.length) {
          this.noUsage = noUsageRulesResults;
        }
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
