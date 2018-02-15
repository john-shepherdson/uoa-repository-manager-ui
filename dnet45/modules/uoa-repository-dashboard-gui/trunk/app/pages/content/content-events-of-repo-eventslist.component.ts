import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvQueryObject, EventsPage } from '../../domain/typeScriptClasses';
import { BrokerService } from '../../services/broker.service';
import { loadingEvents, noEventsForTopic, noEventsWithParams, noServiceMessage } from '../../domain/shared-messages';

@Component ({
  selector: 'app-content-events-of-repo-eventslist',
  templateUrl: 'content-events-of-repo-eventslist.component.html'
})

export class ContentEventsOfRepoEventslistComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
  noEvents: string;
  eventsPageInitialized = false;

  topic = '';
  correctTopic = '';
  repoName = '';

  advanceSearch: AdvQueryObject;
  eventsPage: EventsPage;

  constructor (private route: ActivatedRoute,
               private brokerService: BrokerService) {}

  ngOnInit () {
    this.getParams();
    this.initQuery();
    this.getEventsPage(0);
  }


  getParams() {
    this.topic = this.route.snapshot.paramMap.get('topic');
    this.getCorrectTopic();
    this.repoName = this.route.snapshot.paramMap.get('name');
  }

  initQuery() {
    this.advanceSearch = {
      datasource: this.repoName,
      topic: this.correctTopic,
      titles: [],
      subjects: [],
      authors: [],
      dates: [],
      trust: {min:'0', max:'1'},
      page: 0
    };
  }

  updateQuery() {
    //update advanceSearch
  }

  refreshQuery() {}

  getEventsPage(page: number) {
    this.noEvents = '';
    this.errorMessage = '';
    this. loadingMessage = loadingEvents;
    this.brokerService.advancedShowEvents(page,this.advanceSearch).subscribe(
      page => this.eventsPage = page,
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
      },
      () => {
        this.loadingMessage = '';
        console.log(this.eventsPage);
        if(!this.eventsPage.total) {
          if (!this.eventsPageInitialized)
            this.noEvents = noEventsForTopic;
          else
            this.noEvents = noEventsWithParams;
        }
        this.eventsPageInitialized = true;
      }
    );
  }

  getCorrectTopic() {
    let temp = this.topic.split('|');
    this.correctTopic = temp[0];
    for (let i=1; i<temp.length; i++){
      this.correctTopic += `/${temp[i]}`;
    }
  }

  goToNextPage(){
    if(this.eventsPage.currPage < this.eventsPage.totalPages) {
      console.log(`Get me page ${this.eventsPage.currPage+1}!`);
      this.getEventsPage(this.eventsPage.currPage+1);
    }
  }

  goToPreviousPage(){
    if(this.eventsPage.currPage > 0) {
      console.log(`Get me page ${this.eventsPage.currPage-1}!`);
      this.getEventsPage(this.eventsPage.currPage-1);
    }
  }

}
