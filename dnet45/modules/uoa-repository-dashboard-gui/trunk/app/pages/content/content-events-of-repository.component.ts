import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../services/repository.service';
import { Topic } from '../../domain/typeScriptClasses';
import { ActivatedRoute } from '@angular/router';
import { loadingTopicsError } from '../../domain/shared-messages';

@Component ({
  selector: 'content-events-of-repository',
  templateUrl: 'content-events-of-repository.component.html'
})

export class ContentEventsOfRepositoryComponent implements OnInit {

  repoTopics: Topic[] = [];
  noDatasources: boolean;
  showSpinner: boolean;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getTopics();
  }

  getTopics(): void {
    let name = this.route.snapshot.paramMap.get('name');
    this.showSpinner = true;
    this.repoService.getTopicsForDataSource(name)
      .subscribe(topics => this.repoTopics = topics,
        error => {
          console.log(error);
          this.errorMessage = loadingTopicsError;
          this.showSpinner = false;
        },
        () => {
          if(!this.repoTopics.length) this.noDatasources=true;
          this.showSpinner = false;
        }
      );
  }

}
