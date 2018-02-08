import { Component, OnInit } from '@angular/core';
import { jobTypes } from '../../domain/job-types';


/*DELETE ME LATER*/
import { jobsOfUser } from '../../domain/dummyLists';
import { MonitorService } from '../../services/monitor.service';
import { AuthenticationService } from '../../services/authentication.service';
import { JobsOfUser, StoredJob } from '../../domain/typeScriptClasses';
import { ValidatorService } from '../../services/validator.service';

@Component ({
  selector: 'app-compatibility-validation-history',
  templateUrl: 'compatibility-validation-history.component.html'
})


export class CompatibilityValidationHistoryComponent  implements OnInit {
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
    //call API and get all jobs:
    this.monitorService.getJobsOfUser('ant.lebesis@gmail.com',
                                      'Compatibility Test',
                                      '0',
                                      '10',
                                      '2018-02-01',
                                      '2018-02-28',
                                      'successful',
                                      true).subscribe(
      jobs => {this.jobsOfUser = jobs; console.log(jobs); console.log(this.jobsOfUser);},
      error => console.log(error.status),
      () => {
        this.jobTypes = jobTypes;
        this.totalPages = 10;

        //initialize
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.currentFilter = 'all';
        this.chosenJobType = '';
        this.storedJobs();
      }
    );
  }


  filterJobs(filter: string){
    this.currentFilter = filter;
    console.log(`requesting ${this.currentFilter} jobs`);
    //call api to get filtered jobs
  }

  getItemsPerPage(num: number){
    this.itemsPerPage = num;
  }

  goToNextPage(){
    if(this.currentPage < this.totalPages) {
      //get page current-1 from the API
      //on success current--
      console.log(`Get me page ${this.currentPage + 1}!`);
    }
  }

  goToPreviousPage(){
    if(this.currentPage > 1) {
      //get page current-1 from the API
      //on success current--
      console.log(`Get me page ${this.currentPage - 1}!`);
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
/* WAITING FOR API !
  getJobs() {
    this.monitorService.getJobsOfUser(this.authService.getUserEmail(),
                                      this.chosenJobType,
                                      this.currentPage,
                                      this.itemsPerPage,
                                     null,
                                     null,
                                      this.currentFilter,
                                     true).subscribe(
      jobs => this.jobsOfUser = jobs,
      error => console.log(error)
    );
  }
*/

}

