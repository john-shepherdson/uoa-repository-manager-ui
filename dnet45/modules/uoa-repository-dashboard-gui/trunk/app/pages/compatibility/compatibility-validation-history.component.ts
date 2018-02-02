import { Component, OnInit } from '@angular/core';
import { jobTypes } from '../../domain/job-types';


/*DELETE ME LATER*/
import { jobsOfUser } from '../../domain/dummyLists';

@Component ({
  selector: 'app-compatibility-validation-history',
  templateUrl: 'compatibility-validation-history.component.html'
})


export class CompatibilityValidationHistoryComponent  implements OnInit {
  jobTypes: string[];
  jobsOfUser = jobsOfUser;

  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  currentFilter: string;

  constructor() {}

  ngOnInit() {
    this.loadTable();
  }

  loadTable() {
    //call API and get all jobs:
    this.jobTypes = jobTypes;
    this.totalPages = 10;

    //initialize
    this.itemsPerPage = 10;
    this.currentPage = 1;
    this.currentFilter = 'all';
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

}
