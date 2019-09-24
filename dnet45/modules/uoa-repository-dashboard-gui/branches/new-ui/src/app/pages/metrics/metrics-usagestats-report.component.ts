import { Component, OnInit } from '@angular/core';
import { Repository } from '../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
import { AuthenticationService } from '../../services/authentication.service';
import { loadingRepoMessage } from '../../domain/shared-messages';

@Component({
  selector: 'metrics-usagestats-report',
  templateUrl: './metrics-usagestats-report.component.html'
})

export class MetricsUsagestatsReportComponent implements OnInit {

  errorMessage: string;
  loadingMessage: string;
  title: string;

  repo: Repository;
  repoId: string;
  shownRepoId: string;
  shownOpenaireId: string;
  useCurrentRepo: boolean;
  issnToShow = '';
  chosen_report: string;

  userEmail: string;
  beginDate = '';
  endDate = '';
  itemIdentifier = '';
  itemDataType = '';
  granularity = 'Monthly';

  constructor(private repoService: RepositoryService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) {}

  ngOnInit() {
    this.getParams();
    this.getUserEmail();
    this.getRepo();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
  }

  getParams() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.chosen_report = this.route.snapshot.paramMap.get('reportID');
    this.shownRepoId = this.convertToDisplayedFormat(this.repoId);
    console.log(`shownRepoId is ${this.repoId}`);
    this.title = `${this.chosen_report} report`;
    if (this.chosen_report !== 'RR1') {
      this.useCurrentRepo = true;
    }
  }

  convertToDisplayedFormat(input: string) {
    const tempArray = this.repoId.split('____::');
    return tempArray[0] + ':' + tempArray[1];
  }

  getUserEmail() {
    this.userEmail = this.authService.getUserEmail();
  }

  getRepo() {
    this.loadingMessage = loadingRepoMessage;
    this.repoService.getRepositoryById(this.repoId).subscribe(
      repo => this.repo = repo,
      error => {
        console.log(error);
        this.loadingMessage = '';
          this.errorMessage = 'The repository could not be retrieved';
      },
      () => {
        this.loadingMessage = '';
        if (this.repo.piwikInfo) {
          this.shownOpenaireId = this.convertToDisplayedFormat(this.repo.piwikInfo.openaireId);
        }
        if (this.repo.issn && this.repo.issn !== 'null') {
          this.shownRepoId = this.repo.issn.slice(0, 4) + '-' + this.repo.issn.toString().slice(4);
        }
        this.title = `${this.chosen_report} report for ${this.repo.officialName}`;
        if ( this.authService.activateFrontAuthorization && (this.authService.getUserEmail() !== this.repo.registeredBy.trim()) ) {
          this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
        }
      }
    );
  }

  updateBeginDate(event: any) {
    this.beginDate = event.target.value;
  }

  updateEndDate(event: any) {
    this.endDate = event.target.value;
  }

  updateItemDataType(event: any) {
    this.itemDataType = event.target.value;
  }

  updateItemIdentifier(event: any) {
    this.itemIdentifier = event.target.value;
  }

  updateGranularity(event: any) {
    this.granularity = event.target.value;
  }

  updateUseCurrentRepo(event: any) {
    this.useCurrentRepo = event.target.value;
  }

  goToReport() {
    if (!this.useCurrentRepo) { this.shownRepoId = ''; }
    this.router.navigate(['/getImpact/usagestats-report-results'], {
      queryParams: {
        report: this.chosen_report,
        beginDate: this.beginDate,
        endDate: this.endDate,
        repoId: this.shownRepoId,
        itemDataType: this.itemDataType,
        itemIdentifier: this.itemIdentifier,
        granularity: this.granularity
      }
    });

    /*const params = new URLSearchParams();

    params.append('Report', this.chosen_report);
    params.append('Release', '4');
    params.append('RequestorID', this.authService.getUserEmail());
    params.append('BeginDate', this.beginDate);
    params.append('EndDate', this.endDate);
    params.append('RepositoryIdentifier', this.shownRepoId);
    if (this.itemIdentifier) {
      params.append('ItemIdentifier', this.itemIdentifier);
    }
    if (this.itemDataType) {
      params.append('ItemDataType', this.itemDataType);
    }
    params.append('Pretty', 'Pretty');

    let url = `http://beta.services.openaire.eu/usagestats/sushilite/GetReport/?${params}`;
    console.log(`going to: ${url}`);

    window.location.href = url;*/
  }

}
