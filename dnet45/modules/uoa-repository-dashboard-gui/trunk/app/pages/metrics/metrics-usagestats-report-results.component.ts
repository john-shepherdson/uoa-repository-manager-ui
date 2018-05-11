import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../services/authentication.service';
import { UsagestatsService } from '../../services/usagestats.service';
import { ReportResponse } from '../../domain/usageStatsClasses';

@Component({
  selector: 'metrics-usagestats-report-results',
  templateUrl: 'metrics-usagestats-report-results.component'
})
export class MetricsUsagestatsReportResultsComponent implements OnInit {

  errorMessage: string;
  repoResponse: ReportResponse;

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private usageService: UsagestatsService) {}

  ngOnInit() {
    this.getReportResponse();
  }

  getReportResponse() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let httpOptions = new RequestOptions({ headers: headers });
    let params = new URLSearchParams();

    this.route.queryParams.subscribe( qparams => {
      if (qparams['pretty']) {
        params.append('Pretty', 'Pretty');
      }
      params.append('Report', qparams['report']);
      params.append('Release', '4');
      params.append('RequestorID', this.authService.getUserEmail());
      params.append('BeginDate', qparams['beginDate']);
      params.append('EndDate', qparams['endDate']);
      params.append('RepositoryIdentifier', qparams['repoId']);
      params.append('ItemIdentifier', qparams['itemIdentifier']);
      params.append('Granularity', qparams['granularity']);
    });

    this.usageService.getReportResponse(params).subscribe(
      responseWrapper => {
        this.repoResponse = responseWrapper.ReportResponse
      },
      error => {
        this.errorMessage = 'Failed to load the report results!';
      }
    );

  }
}
