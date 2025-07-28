import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrisStoredJob, JobResultEntry, ValidationError, ValidationResults } from '../../domain/typeScriptClasses';
import { MonitorService } from '../../services/monitor.service';
import { loadingJobSummary, loadingJobSummaryError, noContentRulesResults,
  noUsageRulesResults } from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import { AuthenticationService } from '../../services/authentication.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-compatibility-validation-cris-results',
  templateUrl: 'compatibility-validation-cris-results.component.html'
})

export class CompatibilityValidationCrisResultsComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
  noRulesTested: string;
  noContent: string;
  noUsage: string;

  // jobSummary: StoredJob;
  jobSummary: CrisStoredJob;
  jobDuration: string;
  contentResults: ValidationResults[] = [];
  usageResults: ValidationResults[] = [];
  currentErrors: ValidationError[] = [];

  modalTitle: string;
  isModalShown: boolean;

  ruleNameForContent: string[] = [];
  ruleNameForUsage: string[] = [];
  unprocessedDataForContent: string[] = [];
  unprocessedDataForUsage: string[] = [];
  processedDataForContent: number[] = [];
  processedDataForUsage: number[] = [];

  HighchartsForContent: typeof Highcharts = Highcharts;
  HighchartsForUsage: typeof Highcharts = Highcharts;
  chartOptionsForContent: Highcharts.Options;
  chartOptionsForUsage: Highcharts.Options;

  @ViewChild('checkErrors', { static: true })
  public checkErrors: ConfirmationDialogComponent;

  constructor (private route: ActivatedRoute,
               private router: Router,
               private monitorService: MonitorService,
               private authService: AuthenticationService) {}

  ngOnInit () {
    if (this.authService.getIsUserLoggedIn()) {
      this.getJobInfo();
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      this.authService.redirectUrl = '/compatibility/browseHistory/' + id;
      this.authService.loginWithState();
    }
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  getJobInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadingMessage = loadingJobSummary;
    this.monitorService.getCrisJobSummary(id, 'all').subscribe(
      job => {
        console.log(job);
        this.jobSummary = job;
        if (this.jobSummary.ruleResults && this.jobSummary.ruleResults.length) {
          this.jobSummary.ruleResults.forEach(
            entry => {
              if (entry.type.toLowerCase() === 'content' && entry.errors?.length > 0) {
                this.contentResults.push(entry);
                // this.ruleNameForContent.push(entry.name);
                // this.unprocessedDataForContent.push(entry.successes.split('/')[0]);
              } else if (entry.type.toLowerCase() === 'usage') {
                this.usageResults.push(entry);
                // this.ruleNameForUsage.push(entry.name);
                // this.unprocessedDataForUsage.push(entry.successes.split('/')[0]);
              }
            }
          );
        }
      },
      error => {
        console.error(error);
        this.errorMessage = loadingJobSummaryError;
        this.loadingMessage = '';
      },
      () => {
        this.loadingMessage = '';
        if (!this.jobSummary.ruleResults.length) {
          this.noContent = noContentRulesResults;
        } else {
          this.processedDataForContent = this.unprocessedDataForContent.map(Number);
          this.chartOptionsForContent = {
            title: { text: ''},
            yAxis: { title: { text: 'Number of records' } },
            xAxis: { categories: this.ruleNameForContent },
            series: [{ name: 'For content', data: this.processedDataForContent, type: 'column' }]
          };
        }
        if (!this.usageResults.length) {
          this.noUsage = noUsageRulesResults;
        } else {
          this.processedDataForUsage = this.unprocessedDataForUsage.map(Number);
          this.chartOptionsForUsage = {
            title: { text: ''},
            yAxis: { title: { text: 'Number of records' } },
            xAxis: { categories: this.ruleNameForUsage },
            series: [{ name: 'For usage', data: this.processedDataForUsage, type: 'column' }]
          };
        }
        /*if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.jobSummary.userEmail.trim()) ) {
          this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
        }*/
        if (this.jobSummary.dateFinished) {
          this.jobDuration = this.calculateExecutionTime(this.jobSummary.dateStarted, this.jobSummary.dateFinished);
        }
      }
    );
  }

  viewErrors(errorType: string, errors: ValidationError[], metadataPrefix: string): void {
    this.modalTitle = `Error: ${errorType}`;
    this.currentErrors = [];
    errors.forEach(error => {
      if (error.error === errorType) {
        this.currentErrors.push(error);
        this.currentErrors[this.currentErrors.length-1].metadataPrefix = metadataPrefix;
      }

    });
    this.currentErrors = errors;
    this.checkErrors.showModal();
  }

  linkToError(er: ValidationError) {
    return encodeURI(`${this.jobSummary.url}?verb=GetRecord&metadataPrefix=${er.metadataPrefix}&identifier=${er.identifier}`);
  }

  calculateExecutionTime(start: Date, finish: Date): string {
    const diffMs = new Date(finish).getTime() - new Date(start).getTime(); // Difference in milliseconds

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  splitCamelCase(s: string) {
    return s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

}
