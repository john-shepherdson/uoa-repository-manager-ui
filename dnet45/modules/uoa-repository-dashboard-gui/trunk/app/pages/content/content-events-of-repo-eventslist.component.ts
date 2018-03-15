import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvQueryObject, EventsPage, NotificationFrequency, NotificationMode } from '../../domain/typeScriptClasses';
import { BrokerService } from '../../services/broker.service';
import {
  loadingEvents, noEventsForTopic, noEventsWithParams, noServiceMessage, subscribingChooseFrequency,
  subscribingToEvents,
  subscribingToEventsError, subscribingToeventsSuccess
} from '../../domain/shared-messages';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';

@Component ({
  selector: 'app-content-events-of-repo-eventslist',
  templateUrl: 'content-events-of-repo-eventslist.component.html'
})

export class ContentEventsOfRepoEventslistComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
  successMessage: string;
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
  readonly dateRangeDefinition = { dateFrom: '', dateTo: '' };
  readonly groupDefinition = {
    trustMin: [+''],
    trustMax: [+''],
    eventTitles: this.fb.array([this.initControl(this.titleDefinition)]),
    eventAuthors: this.fb.array([this.initControl(this.authorDefinition)]),
    eventSubjects: this.fb.array([this.initControl(this.subjectDefinition)]),
    eventDateRanges: this.fb.array([this.initControl(this.dateRangeDefinition)])
  };

  frequencyChoice: string;
  userEmail: string;
  modalErrorMessage: string;

  @ViewChild('subscribeToEventsModal')
  public subscribeToEventsModal: ConfirmationDialogComponent;

  constructor (private route: ActivatedRoute,
               private fb: FormBuilder,
               private brokerService: BrokerService,
               private authService: AuthenticationService) {}

  ngOnInit () {
    this.userEmail = this.authService.getUserEmail();
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
    this.group = this.fb.group( this.groupDefinition, { validator: checkMinMax } );
    this.group.get('trustMin').setValue(0);
    this.group.get('trustMax').setValue(1);
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

    controlArray = <FormArray>this.group.controls['eventDateRanges'];
    controlArray.controls = [];
    controlArray.push(this.initControl(this.dateRangeDefinition));

    this.group.get('trustMin').setValue(0);
    this.group.get('trustMax').setValue(1);

    this.initQuery();
    this.getEventsPage(0);
  }

  updateQuery() {
    let i: number;
    let controlArray: FormArray;

    if ( this.group.valid ) {
      this.initQuery();
      this.advanceSearch.trust.min = this.group.get('trustMin').value;
      this.advanceSearch.trust.max = this.group.get('trustMax').value;

      controlArray = <FormArray>this.group.controls['eventTitles'];
      for (i = 0; i < controlArray.length; i++) {
        if (controlArray.at(i).get('eventTitle').value) {
          this.advanceSearch.titles.push(controlArray.at(i).get('eventTitle').value);
        }
      }
      controlArray = <FormArray>this.group.controls['eventAuthors'];
      for (i = 0; i < controlArray.length; i++) {
        if (controlArray.at(i).get('eventAuthor').value) {
          this.advanceSearch.authors.push(controlArray.at(i).get('eventAuthor').value);
        }
      }
      controlArray = <FormArray>this.group.controls['eventSubjects'];
      for (i = 0; i < controlArray.length; i++) {
        if (controlArray.at(i).get('eventSubject').value) {
          this.advanceSearch.subjects.push(controlArray.at(i).get('eventSubject').value);
        }
      }
      controlArray = <FormArray>this.group.controls['eventDateRanges'];
      for (i = 0; i < controlArray.length; i++) {
        if (controlArray.at(i).get('dateFrom').value && controlArray.at(i).get('dateTo').value) {
          this.advanceSearch.dates.push({
            min: controlArray.at(i).get('dateFrom').value,
            max: controlArray.at(i).get('dateTo').value
          });
        }
      }
      console.log(this.advanceSearch);
      this.getEventsPage(0);
    }
  }

  getEventsPage(page: number) {
    this.noEvents = '';
    this.errorMessage = '';
    this.successMessage = '';
    this. loadingMessage = loadingEvents;
    this.brokerService.advancedShowEvents(page,10,this.advanceSearch).subscribe(
      events => this.eventsPage = events,
      error => {
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        console.log(this.eventsPage);
        if (!this.eventsPage.total) {
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

  showSubscriptionModal() {
    if (this.advanceSearch && this.eventsPage) {
      this.subscribeToEventsModal.confirmed = false;
      this.subscribeToEventsModal.showModal();
    }
  }

  choseFrequency(freq: string) {
    this.frequencyChoice = freq;
  }

  subscribeToEvents() {
    this.modalErrorMessage = '';
    if (this.frequencyChoice) {
      this.subscribeToEventsModal.confirmed = true;
      let freq = <NotificationFrequency>this.frequencyChoice;
      let mod: NotificationMode = "EMAIL";
      let sub = {
        subscriber: this.userEmail,
        frequency: freq,
        mode: mod,
        query: this.advanceSearch
      };
      this.errorMessage = '';
      this.successMessage = '';
      console.log(JSON.stringify(sub));
      this.loadingMessage = subscribingToEvents;
      this.brokerService.subscribeToEvent(sub).subscribe(
        response => console.log(`subscribeToEvents responded ${response}`),
        error => {
          this.errorMessage = subscribingToEventsError;
          this.loadingMessage = '';
        },
        () => {
          this.loadingMessage = '';
          this.successMessage = subscribingToeventsSuccess;
        }
      );
    } else {
      this.modalErrorMessage = subscribingChooseFrequency;
    }
  }

}

export function checkMinMax(c: AbstractControl) {
  if( c.get('trustMin').value > c.get('trustMax').value ){
    return 'invalid';
  }
  return null;
}

export function checkDates(c: AbstractControl) {
  if( c.get('dateFrom').value > c.get('dateTo').value ) {
    return 'invalid';
  }
  return null;
}
