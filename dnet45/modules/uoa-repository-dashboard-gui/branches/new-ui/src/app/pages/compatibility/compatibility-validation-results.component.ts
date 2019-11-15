import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobResultEntry, StoredJob } from '../../domain/typeScriptClasses';
import { MonitorService } from '../../services/monitor.service';
import { loadingJobSummary, loadingJobSummaryError, noContentRulesResults,
         noUsageRulesResults } from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import { AuthenticationService } from '../../services/authentication.service';
import * as Highcharts from 'highcharts';
import {text} from '@angular/core/src/render3/instructions';

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

  @ViewChild('checkErrors')
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
                this.ruleNameForContent.push(entry.name);
                this.unprocessedDataForContent.push(entry.successes.split('/')[0]);
              } else if (entry.type === 'usage') {
                this.usageResults.push(entry);
                this.ruleNameForUsage.push(entry.name);
                this.unprocessedDataForUsage.push(entry.successes.split('/')[0]);
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
