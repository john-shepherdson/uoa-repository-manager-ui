import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UsagestatsService } from '../../services/usagestats.service';
import { ReportResponse } from '../../domain/usageStatsClasses';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'metrics-usagestats-report-results',
  templateUrl: 'metrics-usagestats-report-results.component.html',
  styleUrls: ['metrics-usagestats-report-results.component.css']
})
export class MetricsUsagestatsReportResultsComponent implements OnInit {

  loadingMessage: string;
  errorMessage: string;
  infoMessage: string;

  repoResponse: ReportResponse;
  coveredPeriod: string;
  params: URLSearchParams;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedItemIndex: number;

  pageSizeSelect: FormGroup;
  chosenReport: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private usageService: UsagestatsService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.page = 0;
    this.pageSize = 10;
    this.readParams();
    this.pageSizeSelect = this.fb.group({selectPageSize: ['']});
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
  }

  readParams() {
    this.params = new URLSearchParams();

    this.route.queryParams.subscribe( qparams => {
      this.params.append('Report', qparams['report']);
      this.params.append('Release', '4');
      this.params.append('RequestorID', this.authService.getUserEmail());
      this.params.append('BeginDate', qparams['beginDate']);
      this.params.append('EndDate', qparams['endDate']);
      this.params.append('RepositoryIdentifier', qparams['repoId']);
      this.params.append('ItemIdentifier', qparams['itemIdentifier']);
      this.params.append('ItemDataType', qparams['itemIdentifier']);
      this.params.append('Granularity', qparams['granularity']);
    });

    this.chosenReport = this.params.get('Report');
    this.getReportResponse();
  }

  getReportResponse() {
    this.errorMessage = '';
    this.loadingMessage = 'Loading results...';
    this.infoMessage = '';
    this.selectedItemIndex = null;
    this.repoResponse = null;

    this.usageService.getReportResponse(this.page.toString(), this.pageSize.toString(), this.params).subscribe(
      responseWrapper => {
        this.repoResponse = responseWrapper.ReportResponse;
      },
      error => {
        this.errorMessage = 'Failed to load the report results!';
        this.loadingMessage = '';
      },
      () => {
        this.errorMessage = '';
        this.loadingMessage = '';

        this.pageSizeSelect.get('selectPageSize').setValue(this.pageSize);
        this.pageSizeSelect.get('selectPageSize').updateValueAndValidity();

        this.totalPages = Math.ceil(
          +this.repoResponse.ReportDefinition.Filters
                  .ReportAttribute.filter(x => x['Name'] === 'ReportItemCount')[0].Value / this.pageSize);
        if ( this.totalPages === 0 ) {
          this.infoMessage = 'No results were found';
        }

        if (this.repoResponse.ReportDefinition && this.repoResponse.ReportDefinition.Filters &&
            this.repoResponse.ReportDefinition.Filters.ReportAttribute) {

          if (this.repoResponse.Report && this.repoResponse.ReportDefinition.Filters.UsageDateRange &&
            this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin &&
            this.repoResponse.ReportDefinition.Filters.UsageDateRange.End) {
            this.coveredPeriod = this.repoResponse.ReportDefinition.Filters.UsageDateRange.Begin + ' to ';
            this.coveredPeriod = this.coveredPeriod + this.repoResponse.ReportDefinition.Filters.UsageDateRange.End;
          } else {
            const defaultDatePeriod = this.repoResponse.Exception.filter(x => x['Message'] === 'Unspecified Date Arguments');

            this.coveredPeriod = defaultDatePeriod[0].Data.split(':')[1].trim() + ' to ';
            this.coveredPeriod = this.coveredPeriod + defaultDatePeriod[1].Data.split(':')[1].trim() + ' (default)';
          }

        } else {
          this.repoResponse = null;
        }
      }
    );

  }


  getPageSize() {
    this.pageSize = +(this.pageSizeSelect.get('selectPageSize').value);
    this.page = 0;
    this.getReportResponse();
  }

  goToNextPage() {
    if ( (this.page + 1) < this.totalPages) {
      this.page++;
      console.log(`Get me page ${this.page}!`);
      this.getReportResponse();
    }
  }

  goToPreviousPage() {
    if (this.page > 0) {
      this.page--;
      console.log(`Get me page ${this.page}!`);
      this.getReportResponse();
    }
  }

  displayItemPerformance(i: number) {
    if (this.selectedItemIndex === i) {
      this.selectedItemIndex = null;
    } else {
      this.selectedItemIndex = i;
    }
  }

  transformItem(itemIdentifiers: any[]) {
    let field: string;
    if (this.chosenReport === 'RR1') {
      field = 'URL';
    } else {
      field = 'URLs';
    }
    const i = itemIdentifiers.findIndex(x => x['Type'] === field);
    if ( i > -1 ) {
      const urls = itemIdentifiers[i]['Value'];
      return urls.split(';');
    }
    return '';
  }

}
