import {Component, OnInit} from "@angular/core";
import {RepositoryService} from "../../services/repository.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Repository} from "../../domain/typeScriptClasses";
import {Observable} from "rxjs/Observable";
import {ReportResponseWrapper} from "../../domain/usageStatsClasses";


@Component({
  selector: 'metrics-usagestats',
  templateUrl: 'metrics-usagestats.component.html'
})

export class MetricsUsagestatsComponent implements OnInit {

  errorMessage: string;

  repo: Repository;
  repoId: string;
  shownRepoId: string;
  shownOpenaireId: string;
  issnToShow: string = '';
  chosen_report: string;
  disable_report_choice: boolean;

  userEmail: string;
  beginDate: string = '';
  endDate: string = '';
  itemIdentifier: string = '';
  itemDataType: string = '';
  granularity: string = 'Monthly';
  pretty: boolean = true;

  constructor(private repoService: RepositoryService, private route: ActivatedRoute, private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.getRepoId();
    this.getUserEmail();
    this.getRepo();
  }

  getRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.shownRepoId = this.convertToDisplayedFormat(this.repoId);
    console.log(`shownRepoId is ${this.repoId}`);
  }

  convertToDisplayedFormat(input: string) {
    const tempArray = this.repoId.split('____::');
    return tempArray[0] + ':' + tempArray[1];
  }

  onChooseReport(event: any) {
    this.chosen_report = event.target.value;
    console.log('chosen report is', this.chosen_report);
    this.disable_report_choice = true;
  }

  getUserEmail() {
    this.userEmail = this.authService.getUserEmail();
  }

  getRepo() {
    this.repoService.getRepositoryById(this.repoId).subscribe(
      repo => this.repo = repo,
      error => {
        console.log(error);
        this.errorMessage = 'The repository could not be retrieved';
      },
      () => {
        this.shownOpenaireId = this.convertToDisplayedFormat(this.repo.piwikInfo.openaireId);
        if (this.repo.issn){
          this.issnToShow = this.repo.issn.slice(0, 4)+ '-' + this.repo.issn.toString().slice(4);
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

  updatePretty(event: any) {
    this.pretty = !this.pretty;
  }

  goToReport() {
    /* additional field: */
    /*itemIdentifier: this.repo.piwikInfo.openaireId,*/
      /*this.router.navigate(['/getImpact/usagestats-report-results'], {
        queryParams: {
          report: this.chosen_report,
          beginDate: this.beginDate,
          endDate: this.endDate,
          repoId: this.shownRepoId,
          itemDataType: this.itemDataType,
          itemIdentifier: this.itemIdentifier,
          granularity: this.granularity,
          pretty: this.pretty
        }
      });*/

      const params = new URLSearchParams();

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
      params.append('Granularity', this.granularity);
      if (this.pretty && this.pretty === true) {
        params.append('Pretty', 'Pretty');
      }

      let url = `http://beta.services.openaire.eu/usagestats/sushilite/GetReport/?${params}`;
      console.log(`going to: ${url}`);

      window.location.href = url;
  }

}
