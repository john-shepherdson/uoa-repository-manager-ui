import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvQueryObject, EventsPage } from '../../domain/typeScriptClasses';
import { BrokerService } from '../../services/broker.service';
import { loadingEvents, noEventsForTopic, noEventsWithParams, noServiceMessage } from '../../domain/shared-messages';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

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

  group: FormGroup;
  readonly titleDefinition = { eventTitle: [''] };
  readonly authorDefinition = { eventAuthor: [''] };
  readonly subjectDefinition = { eventSubject: [''] };
  readonly groupDefinition = {
    trustRange: Range,
    eventTitles: this.fb.array([this.initControl(this.titleDefinition)]),
    eventAuthors: this.fb.array([this.initControl(this.authorDefinition)]),
    eventSubjects: this.fb.array([this.initControl(this.subjectDefinition)])
  };

  constructor (private route: ActivatedRoute,
               private fb: FormBuilder,
               private brokerService: BrokerService) {}

  ngOnInit () {
    this.getParams();
    this.initQuery();
    this.initForm();
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

  initForm() {
    this.group = this.fb.group( this.groupDefinition );
  }

  initControl(definition: any) {
    return this.fb.group(definition);
  }

  removeControl(controlName: string, i: number) {
    let controlArray = <FormArray>this.group.controls[controlName];
    controlArray.removeAt(i);
  }

  addControl(controlName: string, definition: any) {
    let controlArray = <FormArray>this.group.controls[controlName];
    controlArray.push(this.initControl(definition));
  }

  clearForm() {
    let controlArray: FormArray;
    controlArray = <FormArray>this.group.controls['eventTitles'];
    controlArray.controls = [];
    controlArray.push(this.initControl(this.titleDefinition));

    controlArray = <FormArray>this.group.controls['eventAuthors'];
    controlArray.controls = [];
    controlArray.push(this.initControl(this.authorDefinition));

    controlArray = <FormArray>this.group.controls['eventSubjects'];
    controlArray.controls = [];
    controlArray.push(this.initControl(this.subjectDefinition));
  }

  updateQuery() {
    let i: number;
    let controlArray: FormArray;

    this.initQuery();
    controlArray = <FormArray>this.group.controls['eventTitles'];
    for (i=0; i<controlArray.length; i++) {
      if (controlArray.at(i).get('eventTitle').value) {
        this.advanceSearch.titles.push(controlArray.at(i).get('eventTitle').value);
      }
    }
    controlArray = <FormArray>this.group.controls['eventAuthors'];
    for (i=0; i<controlArray.length; i++) {
      if (controlArray.at(i).get('eventAuthor').value) {
        this.advanceSearch.authors.push(controlArray.at(i).get('eventAuthor').value);
      }
    }
    controlArray = <FormArray>this.group.controls['eventSubjects'];
    for (i=0; i<controlArray.length; i++) {
      if (controlArray.at(i).get('eventSubject').value) {
        this.advanceSearch.subjects.push(controlArray.at(i).get('eventSubject').value);
      }
    }

    this.getEventsPage(0);
  }

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
        this.clearForm();
      }
    );
  }

  getCorrectTopic() {
    let temp = this.topic.split('|');
    this.correctTopic = temp[0];
    this.topic = temp[0];
    for (let i=1; i<temp.length; i++){
      this.correctTopic += `/${temp[i]}`;
      this.topic += ` | ${temp[i]}`;
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
