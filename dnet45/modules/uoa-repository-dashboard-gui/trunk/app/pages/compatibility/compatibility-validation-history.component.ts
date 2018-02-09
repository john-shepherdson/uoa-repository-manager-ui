import { Component, OnInit } from '@angular/core';
import { jobTypes } from '../../domain/job-types';


/*DELETE ME LATER*/
import { jobsOfUser } from '../../domain/dummyLists';
import { MonitorService } from '../../services/monitor.service';
import { AuthenticationService } from '../../services/authentication.service';
import { JobsOfUser, StoredJob } from '../../domain/typeScriptClasses';
import { ValidatorService } from '../../services/validator.service';
import { loadingUserJobs, loadingUserJobsError, noUserJobsFound } from '../../domain/shared-messages';
import { stat } from 'fs';

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
    // RESTORE IN THE END this.userEmail = this.authService.getUserEmail();
    this.userEmail = 'ant.lebesis@gmail.com';
    this.jobTypes = jobTypes;
    this.itemsPerPage = 10;
    this.currentPage = 1;
    this.currentFilter = 'all';
    this.chosenJobType = 'Compatibility Test';

    //call API and get all jobs:
    this.getJobs();
  }


  filterJobs(filter: string){
    this.currentFilter = filter;
    console.log(`requesting ${this.currentFilter} jobs`);
    this.getJobs();
  }

  getItemsPerPage(num: number){
    this.itemsPerPage = num;
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
    if(this.currentPage > 1) {
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
    setTimeout( () => {
      this.monitorService.getJobsOfUser(this.userEmail,
                                        this.chosenJobType,
                                        (this.currentPage-1).toString(),
                                        this.itemsPerPage.toString(),
                                        '',
                                        '',
                                        this.currentFilter,
                                        true).subscribe(
        jobs => this.jobsOfUser = jobs,
        error => {
          console.log(`The API returned ${error.status}`);
          this.errorMessage = loadingUserJobsError;
        },
        () => {
          this.totalPages = Math.ceil(this.jobsOfUser.totalJobs / this.itemsPerPage);
          this.loadingMessage = '';
          this.errorMessage = '';
          if (!this.totalPages) {
            this.infoMessage = noUserJobsFound;
          }
          if (!this.jobsOfUser.jobs) {
            this.errorMessage = loadingUserJobsError;
          }
        }
      );
    },500);
  }

  getResultImage(status: string) {
    let assets = 'assets/imgs';
    if (status == 'successful') {
      return `${assets}/icon_colours-check.jpg`;
    } else if (status == 'failed') {
      return `${assets}/icon_colours-x.jpg`;
    } else {
      return `${assets}/icon_colours-question.jpg`;
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
  }

}

