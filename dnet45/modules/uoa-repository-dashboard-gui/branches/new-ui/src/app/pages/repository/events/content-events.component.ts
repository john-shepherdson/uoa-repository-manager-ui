import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { BrokerService } from '../../../services/broker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { loadingRepoMessage, loadingUserRepoInfoEmpty, reposRetrievalError } from '../../../domain/shared-messages';

@Component ({
  selector: 'app-content-events',
  templateUrl: 'content-events.component.html'
})

export class ContentEventsComponent implements OnInit {
  datasourcesOfUser = [];
  tilesView: boolean;
  errorMessage: string;
  noDatasourcesMessage: string;
  loadingMessage: string;

  @Input() parent = '';

  constructor(private authService: AuthenticationService,
              private brokerService: BrokerService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.tilesView = true;
    this.getDatasourcesOfUser();
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("top_bar_active");   //add the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }


  getDatasourcesOfUser() {
    this.loadingMessage = loadingRepoMessage;
    this.brokerService.getDatasourcesOfUser().subscribe(
      res => {
        this.datasourcesOfUser = res['datasourcesOfUser'];
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = reposRetrievalError;
      },
      () => {
        this.loadingMessage = '';
        if (!this.datasourcesOfUser || !this.datasourcesOfUser.length) {
          this.noDatasourcesMessage = loadingUserRepoInfoEmpty;
        } else {
          this.datasourcesOfUser.sort( function(a, b) {
            if ( a['first']['value'] < b['first']['value'] ) {
              return -1;
            } else if (a['first']['value'] > b['first']['value']) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      }
    );
  }

  toggleTiles() {
    this.tilesView = !this.tilesView;
  }

  goToRepoEvents(repoName: string) {
    const newName = repoName.replace(/\//g, '|');
    this.router.navigate([newName], {relativeTo: this.route});
  }

  changeView(view: string) {
    this.tilesView = (view == 'tiles');
  }

}
