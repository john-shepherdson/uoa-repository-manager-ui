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

  index = 0;
  ruleName: string[] = [];
  unprocessedData: string[] = [];
  processedData: number[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

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
                this.ruleName.push(entry.name);
                this.unprocessedData.push(entry.successes.split('/')[0]);
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
        } else {
          this.processedData = this.unprocessedData.map(Number);
          this.chartOptions = {
            title: { text: 'Number of records'},
            yAxis: { title: { text: 'Number of records' } },
            xAxis: { categories: this.ruleName },
            series: [{ name: 'For content', data: this.processedData, type: 'column' }]
          };
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
