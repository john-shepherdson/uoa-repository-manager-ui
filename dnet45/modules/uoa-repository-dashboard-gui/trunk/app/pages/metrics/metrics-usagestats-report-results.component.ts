import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UsagestatsService } from '../../services/usagestats.service';
import { ReportResponse } from '../../domain/usageStatsClasses';
import {ar1_report_results} from "../../domain/sushilite_demo_data/AR1_ex";

@Component({
  selector: 'metrics-usagestats-report-results',
  templateUrl: 'metrics-usagestats-report-results.component.html'
})
export class MetricsUsagestatsReportResultsComponent implements OnInit {

  errorMessage: string;

  repoResponse = ar1_report_results['ReportResponse'];
  coveredPeriod: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private usageService: UsagestatsService) {}

  ngOnInit() {
    //this.getReportResponse();
    if (this.repoResponse.Report && this.repoResponse.ReportDefinition.Filters.UsageDateRange &&
      this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin && this.repoResponse.ReportDefinition.Filters.UsageDateRange.End) {
      this.coveredPeriod = this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin + ' to ' + this.repoResponse.ReportDefinition.Filters.UsageDateRange.End;
    } else {
      let defaultDatePeriod = this.repoResponse.Exception.filter(x => x['Message'] === 'Unspecified Date Arguments');
      this.coveredPeriod = defaultDatePeriod[0].Data.split(':')[1].trim() + ' to ' + defaultDatePeriod[1].Data.split(':')[1].trim() + ' (default)';
    }
  }

  getReportResponse() {
    let params = new URLSearchParams();

    this.route.queryParams.subscribe( qparams => {
      params.append('Report', qparams['report']);
      params.append('Release', '4');
      params.append('RequestorID', this.authService.getUserEmail());
      params.append('BeginDate', qparams['beginDate']);
      params.append('EndDate', qparams['endDate']);
      params.append('RepositoryIdentifier', qparams['repoId']);
      if (qparams['itemIdentifier']) {
        params.append('ItemIdentifier', qparams['itemIdentifier']);
      }
      if (qparams['itemDataType']) {
        params.append('ItemDataType', qparams['itemIdentifier']);
      }
      params.append('Granularity', qparams['granularity']);
      if (qparams['pretty'] && qparams['pretty']==='true') {
        params.append('Pretty', 'Pretty');
      }
    });

    this.usageService.getReportResponse(params).subscribe(
      responseWrapper => {
        this.repoResponse = responseWrapper.ReportResponse
      },
      error => {
        this.errorMessage = 'Failed to load the report results!';
      },
      () => {
        if (this.repoResponse.Report && this.repoResponse.ReportDefinition.Filters.UsageDateRange &&
          this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin && this.repoResponse.ReportDefinition.Filters.UsageDateRange.End) {
          this.coveredPeriod = this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin + ' to ' + this.repoResponse.ReportDefinition.Filters.UsageDateRange.End;
        } else {
          let defaultDatePeriod = this.repoResponse.Exception.filter(x => x['Message'] === 'Unspecified Date Arguments');
          this.coveredPeriod = defaultDatePeriod[0].Data.split(':')[1].trim() + ' to ' + defaultDatePeriod[1].Data.split(':')[1].trim() + ' (default)';
        }
      }
    );

  }
}
