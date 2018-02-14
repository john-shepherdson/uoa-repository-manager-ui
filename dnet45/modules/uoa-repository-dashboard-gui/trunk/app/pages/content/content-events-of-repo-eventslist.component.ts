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
  repoName = '';

  advanceSearch: AdvQueryObject;
  eventsPage: EventsPage;

  constructor (private route: ActivatedRoute,
               private brokerService: BrokerService) {}

  ngOnInit () {
    this.getParams();
    this.initQuery();
    this.getEventsPage();
  }


  getParams() {
    this.topic = this.route.snapshot.paramMap.get('topic');
    this.repoName = this.route.snapshot.paramMap.get('name');
  }

  initQuery() {
    this.advanceSearch = {
      datasource: this.repoName,
      topic: '',
      titles: [],
      subjects: [],
      authors: [],
      dates: [],
      trust: {min:'0', max:'1'},
      page: 0
    };
  }

  getEventsPage() {
    this.noEvents = '';
    this.errorMessage = '';
    this. loadingMessage = loadingEvents;
    this.brokerService.advancedShowEvents(this.advanceSearch).subscribe(
      page => this.eventsPage = page,
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
      },
      () => {
        this.loadingMessage = '';
        if(!this.eventsPage.totalPages) {
          if (!this.eventsPageInitialized)
            this.noEvents = noEventsForTopic;
          else
            this.noEvents = noEventsWithParams;
        }
        this.eventsPageInitialized = true;
      }
    );
  }


}
