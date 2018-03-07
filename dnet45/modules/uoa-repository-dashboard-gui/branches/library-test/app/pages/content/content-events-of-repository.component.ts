import { Component, OnInit } from '@angular/core';
import { BrowseEntry, Term } from '../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { loadingTopics, loadingTopicsError, noTopicsFound } from '../../domain/shared-messages';
import { BrokerService } from '../../services/broker.service';

@Component ({
  selector: 'content-events-of-repository',
  templateUrl: 'content-events-of-repository.component.html'
})

export class ContentEventsOfRepositoryComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;
  noTopics: string;

  chosenEvent = 'another/blabla';
  repoName = '';
  topics: Map<string,Term> = new Map<string,Term>();
  repoTopics: BrowseEntry[] = [];
  moreList: BrowseEntry[] = [];
  missingList: BrowseEntry[] = [];
  totalMore = 0;
  totalMissing = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brokerService: BrokerService
  ) {}

  ngOnInit() {
    this.repoName = this.route.snapshot.paramMap.get('name');
    setTimeout(() => {
      this.getTopics();
    },500);
  }

  getRepoTopics(): void {
    this.loadingMessage = loadingTopics;
    this.brokerService.getTopicsForDataSource(this.repoName)
      .subscribe(
        topics => {
          this.repoTopics = topics;
        },
        error => {
          console.log(error);
          this.errorMessage = loadingTopicsError;
          this.loadingMessage = '';
        },
        () => {
          this.loadingMessage = '';
          if(this.repoTopics.length == 0){
            this.noTopics=noTopicsFound;
          } else {
            for(let browseEntry of this.repoTopics) {
              if(browseEntry.value.startsWith("ENRICH/MORE")) {
                this.totalMore += browseEntry.size;
                this.moreList.push(browseEntry);
              }
              else if(browseEntry.value.startsWith("ENRICH/MISSING")) {
                this.totalMissing += browseEntry.size;
                this.missingList.push(browseEntry);
              }
            }
          }
        }
      );
  }


  getTopics () {
    this.loadingMessage = loadingTopics;
    this.brokerService.getDnetTopics().subscribe(
      topics => this.topics = topics,
      error => {
        console.log(error);
        this.errorMessage = loadingTopicsError;
        this.loadingMessage = '';
      },
      () => {
        this.loadingMessage = '';
        console.log(this.topics);
        this.getRepoTopics();
      }
    );
  }

  goToEventsList(topic: string) {
    let temp = topic.split('/');
    let chosenTopic = temp[0];
    for (let i=1; i<temp.length; i++){
      chosenTopic += `|${temp[i]}`;
    }
    this.router.navigate([`${chosenTopic}`], { relativeTo: this.route });
  }


}
