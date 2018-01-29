import { Component, OnInit } from '@angular/core';

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
  noOfPages: number;
  currentPageId: number;
  totalPages: number;

  constructor() {}

  ngOnInit() {
    this.jobTypes = ["Compatibility Test","Registration Request","Workflow Request"];
    this.itemsPerPage = 10;
    this.currentPageId = 1;
  }

  getItemsPerPage(num: number){
    this.itemsPerPage = num;
    console.log(`I got ${num}`);
  }
}
