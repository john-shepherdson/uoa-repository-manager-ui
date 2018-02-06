import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../services/repository.service';
import { Topic } from '../../domain/typeScriptClasses';
import { ActivatedRoute } from '@angular/router';
import { loadingTopics, loadingTopicsError } from '../../domain/shared-messages';
import { BrokerService } from '../../services/broker.service';

@Component ({
  selector: 'content-events-of-repository',
  templateUrl: 'content-events-of-repository.component.html'
})

export class ContentEventsOfRepositoryComponent implements OnInit {

  repoTopics: Topic[] = [];
  noDatasources: boolean;
  showSpinner: boolean;
  errorMessage: string;
  loadingMessage: string;

  constructor(
    private route: ActivatedRoute,
    private brokerService: BrokerService
  ) {}

  ngOnInit() {
    this.getTopics();
  }

  getTopics(): void {
    let name = this.route.snapshot.paramMap.get('name');
    this.showSpinner = true;
    this.loadingMessage = loadingTopics;
    this.brokerService.getTopicsForDataSource(name)
      .subscribe(
        topics => {
          this.repoTopics = topics;
          if(!this.repoTopics.length) this.noDatasources=true;
        },
        error => console.log(error),
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
        }
      );
  }

}
