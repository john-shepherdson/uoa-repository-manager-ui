import { Component, OnInit } from '@angular/core';
import { jobTypes } from '../../domain/job-types';


/*DELETE ME LATER*/
import { MonitorService } from '../../services/monitor.service';
import { AuthenticationService } from '../../services/authentication.service';
import { JobsOfUser, StoredJob } from '../../domain/typeScriptClasses';
import { ValidatorService } from '../../services/validator.service';
import { loadingUserJobs, loadingUserJobsError, noUserJobsFound } from '../../domain/shared-messages';
import { URLParameter } from '../../domain/url-parameter';

@Component ({
  selector: 'app-compatibility-validation-history',
  templateUrl: 'compatibility-validation-history.component.html'
})


export class CompatibilityValidationHistoryComponent  implements OnInit {
  userEmail: string;
  loadingMessage: string;
  errorMessage: string;
  infoMessage: string;
  successMessage: string;
  failureMessage: string;

  jobTypes: string[];
  jobsOfUser: JobsOfUser;
  jobs: StoredJob[];

  itemsPerPage: number;
  currentPage: number;
  currentTotalJobs: number;
  totalPages: number;
  currentFilter: string;
  chosenJobType: string;

  constructor(private authService: AuthenticationService,
              private monitorService: MonitorService,
              private valService: ValidatorService) {}

  ngOnInit() {
    this.loadTable();
  }

  loadTable() {
    //initialize
    this.userEmail = this.authService.getUserEmail();
    this.jobTypes = jobTypes;
    this.itemsPerPage = 10;
    this.currentPage = 0;
    this.currentFilter = 'all';
    this.chosenJobType = '';

    //call API and get all jobs:
    this.getJobs();
  }


  getJobType(type: string) {
    this.chosenJobType = type;
    this.currentPage = 0;
    this.getJobs();
  }

  filterJobs(filter: string){
    this.currentFilter = filter;
    this.currentPage = 0;
    console.log(`requesting ${this.currentFilter} jobs`);
    this.getJobs();
  }

  getItemsPerPage(num: number){
    this.itemsPerPage = num;
    this.currentPage = 0;
    this.getJobs();
  }

  goToNextPage(){
    if(this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log(`Get me page ${this.currentPage}!`);
      this.getJobs();
    }
  }

  goToPreviousPage(){
    if(this.currentPage > 0) {
      this.currentPage--;
      console.log(`Get me page ${this.currentPage}!`);
      this.getJobs();
    }
  }

  storedJobs () {
    this.valService.getStoredJobsNew('ant.lebesis@gmail.com',
      'Compatibility Test',
      '0',
      '10',
      '2018-02-01',
      '2018-02-28',
      'successful').subscribe(
      jobs => this.jobs = jobs,
      error => console.log(error.status),
      () => {
        console.log('Also hit getStoredJobsNew and got:');
        console.log(this.jobs);
      }
    );
  }

  getJobs() {
    this.loadingMessage = loadingUserJobs;
    this.errorMessage = '';
    this.infoMessage = '';
    this.successMessage = '';
    this.failureMessage = '';
    let params: URLParameter[] = [];
    params.push({key: 'user', value: [this.userEmail]});
    if ( this.chosenJobType ) {
      params.push({key: 'jobType', value: [this.chosenJobType]});
    }
    params.push({key: 'offset', value: [( (this.currentPage)*this.itemsPerPage).toString()]});
    params.push({key: 'limit', value: [this.itemsPerPage.toString()]});
    /*  can also add dateFrom and dateTo if needed */
    params.push({key: 'validationStatus', value: [this.currentFilter]});
    params.push({key: 'includeJobsTotal', value: ['true']});
    this.monitorService.getJobsOfUser(params).subscribe(
      jobs => this.jobsOfUser = jobs,
      error => {
        console.log(`The API returned ${error.status}`);
        this.errorMessage = loadingUserJobsError;
      },
      () => {
        if (this.currentFilter == 'all') {
          this.currentTotalJobs = this.jobsOfUser.totalJobs;
        } else if (this.currentFilter == 'successful') {
          this.currentTotalJobs = this.jobsOfUser.totalJobsSuccessful;
        } else if (this.currentFilter == 'failed') {
          this.currentTotalJobs = this.jobsOfUser.totalJobsFailed;
        } else {
          this.currentTotalJobs = this.jobsOfUser.totalJobsOngoing;
        }
        this.totalPages = Math.ceil(this.currentTotalJobs / this.itemsPerPage);
        this.loadingMessage = '';
        if (!this.totalPages || !this.jobsOfUser.jobs) {
          this.infoMessage = noUserJobsFound;
          this.currentPage = -1;
        }
      }
    );
  }

  getResultImage(ended: string, error: string) {
    if (!ended) {
      return `../../../assets/imgs/icon_colours-question.jpg`;
    } else {
      if (error == 'no errors') {
        return `../../../assets/imgs/icon_colours-check.jpg`;
      } else {
        return `../../../assets/imgs/icon_colours-x.jpg`;
      }
    }
  }

  resubmitJob (id: string) {
    this.valService.reSubmitJobForValidation(id).subscribe(
      res => this.successMessage = `The job with id ${id} was successfully resubmitted`,
      error => {
        this.failureMessage = `Could not resubmit the job with id ${id}`;
        console.log(error);
      }
    );
    this.getJobs();
  }

}

