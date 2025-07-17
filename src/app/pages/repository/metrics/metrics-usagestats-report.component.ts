import { Component, OnInit } from '@angular/core';
import { Repository } from '../../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { loadingRepoMessage } from '../../../domain/shared-messages';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'metrics-usagestats-report',
  templateUrl: './metrics-usagestats-report.component.html',
  styles: [`#back-fab {
    position: fixed;
    bottom: 5vh;
    right: 5vw;
    z-index: 980;
  }`],
})

export class MetricsUsagestatsReportComponent implements OnInit {

  errorMessage: string;
  loadingMessage: string;
  title: string;

  repo: Repository;
  // repoId: string;
  shownRepoId: string;
  shownOpenaireId: string;
  useCurrentRepo: boolean;
  issnToShow = '';
  chosen_report: string;

  userEmail: string;
  release: string;
  beginDate = '';
  endDate = '';
  itemIdentifier = '';
  datasetIdentifier = '';
  totalItemRequests = '';
  totalItemInvestigations = '';
  uniqueItemRequests = '';
  uniqueItemInvestigations = '';
  dataType = '';
  granularity = 'Monthly';

  constructor(private repoService: RepositoryService,
              private sharedService: SharedService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) {}

  ngOnInit() {

    if (this.sharedService.getRepository()) {
      this.repo = this.sharedService.getRepository();
      this.getInfo();
    }

    this.sharedService.repository$.subscribe(
      r => {
        this.repo = r;
        this.getInfo();
      }
    );

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('top_bar_active');   // remove the class
    body.classList.remove('page_heading_active');
    body.classList.remove('landing');
    body.classList.add('dashboard');
  }

  getInfo() {
    this.getParams();
    this.getUserEmail();
    if (this.repo.piwikInfo) {
      this.shownOpenaireId = this.convertToDisplayedFormat(this.repo.piwikInfo.openaireId);
    }
    if (this.repo.issn && this.repo.issn !== 'null') {
      this.shownRepoId = this.repo.issn.slice(0, 4) + '-' + this.repo.issn.toString().slice(4);
    }
    this.title = `${this.chosen_report} report for ${this.repo.officialname}`;
  }

  getParams() {
    // this.repoId = this.route.snapshot.paramMap.get('id');
    this.release = this.route.snapshot.paramMap.get('reportType').slice(1, 2);
    this.chosen_report = this.route.snapshot.paramMap.get('reportID');
    if (this.release === '5') {
      if (this.chosen_report === 'DSR') {
        this.totalItemRequests = 'Total_Dataset_Requests';
        this.totalItemInvestigations = 'Total_Dataset_Investigations';
        this.uniqueItemRequests = 'Unique_Dataset_Requests';
        this.uniqueItemInvestigations = 'Unique_Dataset_Investigations';
      } else {
        this.totalItemRequests = 'Total_Item_Requests';
        this.totalItemInvestigations = 'Total_Item_Investigations';
        this.uniqueItemRequests = 'Unique_Item_Requests';
        this.uniqueItemInvestigations = 'Unique_Item_Investigations';
      }
    }
    this.shownRepoId = this.convertToDisplayedFormat(this.repo.id);
    console.log(`shownRepoId is ${this.repo.id}`);
    this.title = `${this.chosen_report} report`;
    if (this.chosen_report !== 'RR1') {
      this.useCurrentRepo = true;
    }
  }

  convertToDisplayedFormat(input: string) {
    const tempArray = this.repo.id.split('____::');
    return tempArray[0] + ':' + tempArray[1];
  }

  getUserEmail() {
    this.userEmail = this.authService.getUserEmail();
  }

  // getRepo() {
  //   this.loadingMessage = loadingRepoMessage;
  //   this.repoService.getRepositoryById(this.repoId).subscribe(
  //     repo => this.repo = repo,
  //     error => {
  //       console.log(error);
  //       this.loadingMessage = '';
  //         this.errorMessage = 'The repository could not be retrieved';
  //     },
  //     () => {
  //       this.loadingMessage = '';
  //       if (this.repo.piwikInfo) {
  //         this.shownOpenaireId = this.convertToDisplayedFormat(this.repo.piwikInfo.openaireId);
  //       }
  //       if (this.repo.issn && this.repo.issn !== 'null') {
  //         this.shownRepoId = this.repo.issn.slice(0, 4) + '-' + this.repo.issn.toString().slice(4);
  //       }
  //       this.title = `${this.chosen_report} report for ${this.repo.officialName}`;
  //     }
  //   );
  // }

  updateBeginDate(event: any) {
    this.beginDate = event.target.value;
  }

  updateEndDate(event: any) {
    this.endDate = event.target.value;
  }

  updateItemDataType(event: any) {
    this.dataType = event.target.value;
  }

  updateItemIdentifier(event: any) {
    this.itemIdentifier = event.target.value;
  }

  updateDatasetIdentifier(event: any) {
    this.datasetIdentifier = event.target.value;
  }

  updateGranularity(event: any) {
    this.granularity = event.target.value;
  }

  updateUseCurrentRepo(event: any) {
    this.useCurrentRepo = event.target.value;
  }

  updateTotalItemRequests(event: any) {
    if (event.target.checked) {
      this.totalItemRequests = event.target.value;
    } else {
      this.totalItemRequests = null;
    }
  }

  updateUniqueItemRequests(event: any) {
    if (event.target.checked) {
      this.uniqueItemRequests = event.target.value;
    } else {
      this.uniqueItemRequests = null;
    }
  }

  updateTotalItemInvestigations(event: any) {
    if (event.target.checked) {
      this.totalItemInvestigations = event.target.value;
    } else {
      this.totalItemInvestigations = null;
    }
  }

  updateUniqueItemInvestigations(event: any) {
    if (event.target.checked) {
      this.uniqueItemInvestigations = event.target.value;
    } else {
      this.uniqueItemInvestigations = null;
    }
  }

  goToReport() {
    if (!this.useCurrentRepo) { this.shownRepoId = ''; }
    const metricTypes: string[] = [];
    if (this.totalItemRequests !== null) {
      metricTypes.push(this.totalItemRequests);
    }
    if (this.totalItemInvestigations !== null) {
      metricTypes.push(this.totalItemRequests);
    }
    if (this.uniqueItemRequests !== null) {
      metricTypes.push(this.uniqueItemRequests);
    }
    if (this.uniqueItemInvestigations  !== null) {
      metricTypes.push(this.uniqueItemInvestigations);
    }
    this.router.navigate(['usagestats-report-results'], {
      relativeTo: this.route.parent,
      queryParams: {
        report: this.chosen_report,
        release: this.release,
        beginDate: this.beginDate,
        endDate: this.endDate,
        repoId: this.shownRepoId,
        dataType: this.dataType,
        itemIdentifier: this.itemIdentifier,
        datasetIdentifier: this.datasetIdentifier,
        granularity: this.granularity,
        // metricTypes: metricTypes,
        totalItemRequests: this.totalItemRequests,
        totalItemInvestigations: this.totalItemInvestigations,
        uniqueItemRequests: this.uniqueItemRequests,
        uniqueItemInvestigations: this.uniqueItemInvestigations
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
