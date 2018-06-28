import {Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {BrokerService} from "../../services/broker.service";
import {loadingRepoMessage, loadingUserRepoInfoEmpty, reposRetrievalError} from "../../domain/shared-messages";
import {ActivatedRoute, Router} from "@angular/router";

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

  @Input() parent: string = '';

  constructor(private authService: AuthenticationService,
              private brokerService: BrokerService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.tilesView = true;
    this.getDatasourcesOfUser();
  }


  getDatasourcesOfUser() {
    this.loadingMessage = loadingRepoMessage;
    this.brokerService.getDatasourcesOfUser(this.authService.getUserEmail()).subscribe(
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
        /*} else {
          this.datasourcesOfUser.forEach(
            d => {
              console.log( d['first']['value'],' -> ',d['first']['size'] );
            }
          );*/
        }
      }
    );
  }

  toggleTiles(){
    this.tilesView = !this.tilesView;
  }

  goToRepoEvents(repoName: string) {
    const newName = repoName.replace(/\//g,'|');
    this.router.navigate([newName], {relativeTo: this.route});
  }

}
