import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrokerService } from '../../services/broker.service';
import { loadingEvents, noEventsForTopic, noServiceMessage } from '../../domain/shared-messages';
import { EventsPage } from '../../domain/typeScriptClasses';

@Component ({
  selector: 'app-content-notifications-of-subscription',
  templateUrl: 'content-notifications-of-subscription.component.html'
})

export class ContentNotificationsOfSubscriptionComponent implements OnInit {
  noEvents: string;
  errorMessage: string;
  loadingMessage: string;

  subId: string;
  topic: string;
  eventsPage: EventsPage;

  constructor(private route: ActivatedRoute,
              private brokerService: BrokerService) {}

  ngOnInit () {
    this.subId = this.route.snapshot.paramMap.get('id');
    this.getEventsPage(0);
  }

  getEventsPage(page: number) {
    this.noEvents = '';
    this.errorMessage = '';
    this. loadingMessage = loadingEvents;
    this.brokerService.getNotificationsBySubscriptionId(this.subId, page,10).subscribe(
      events => this.eventsPage = events,
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        console.log(this.eventsPage);
        if (!this.eventsPage.total)
          this.noEvents = noEventsForTopic;
        this.getCorrectTopic();
      }
    );
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


  getCorrectTopic() {
    let temp = this.eventsPage.topic.split('/');
    this.topic = temp[0];
    for (let i=1; i<temp.length; i++){
      this.topic += ` | ${temp[i]}`;
    }
  }
}
