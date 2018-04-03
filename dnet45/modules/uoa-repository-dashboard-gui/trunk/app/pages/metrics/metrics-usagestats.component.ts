import {Component, OnInit} from "@angular/core";
import {RepositoryService} from "../../services/repository.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Repository} from "../../domain/typeScriptClasses";


@Component({
  selector: 'metrics-usagestats',
  templateUrl: 'metrics-usagestats.component.html'
})

export class MetricsUsagestatsComponent implements OnInit {

  errorMessage: string;

  repo: Repository;
  repoId: string;
  issnToShow: string = '';
  chosen_report: string;
  disable_report_choice: boolean;

  userEmail: string;
  beginDate: string = '';
  endDate: string = '';
  itemIdentifier: string = '';
  itemDataType: string = '';
  granularity: string;
  pretty: boolean = true;

  constructor(private repoService: RepositoryService, private route: ActivatedRoute, private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    this.getUserEmail();
    this.getRepo();
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

  updateItemIdentifier(event: any) {
    this.itemIdentifier = event.target.value;
  }

  updateItemDataType(event: any) {
    this.itemDataType = event.target.value;
  }

  updateGranularity(event: any) {
    this.granularity = event.target.value;
  }

  updatePretty(event: any) {
    this.pretty = !this.pretty;
  }

  goToReport() {
    let prettyString: string = '';
    if (this.pretty) {
      prettyString = `&Pretty=Pretty`;
    }

    let url = `http://beta.services.openaire.eu/usagestats/sushilite/GetReport/?Report=${this.chosen_report}=4&RequestorID=${this.userEmail}&BeginDate=${this.beginDate}&EndDate=${this.endDate}&RepositoryIdentifier=${this.repoId}&ItemIdentifier=${this.itemIdentifier}&Granularity=${this.granularity}${prettyString}`;
    window.open(url,"_blank");
  }

}
