import { Component, OnInit, ViewChild } from '@angular/core';
import { RepositoryService } from '../../services/repository.service';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import { loadingReposMessage, reposRetrievalError } from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';

@Component ({
  selector: 'app-admin-metrics',
  templateUrl: 'adminPg-metrics.component.html'
})

export class AdminPgMetricsComponent implements OnInit {
  piwiks: PiwikInfo[] = [];
  showSpinner: boolean;
  errorMessage: string;
  loadingMessage: string;

  modalTitle = "Approval Confirmation";
  modalButton = "Yes, validate";
  isModalShown: boolean;

  @ViewChild('confirmApprovalModal')
  public confirmApprovalModal: ConfirmationDialogComponent;

  constructor(private authService: AuthenticationService,
              private repoService: RepositoryService) {}

  ngOnInit() {
    this.getPiwiks();
    this.isModalShown = false;
  }


  /* NEEDS TO CALL GET PIWIK INFO INSTEAD!! */
  getPiwiks(){
    this.piwiks = [
      {
        'repositoryId': 'repo_id',
        'openaireId': 'oa_id',
        'repositoryName': 'the repo name',
        'country': 'Greece',
        'siteId': '123',
        'authenticationToken': '32846584f571be9b57488bf4088f30ea',
        'creationDate':  new Date(2018, 1, 3),
        'requestorName': 'Bla blabla',
        'requestorEmail': 'blabla@gmail.com',
        'validated': false,
        'validationDate':  new Date(2018, 1, 3),
        'comment' : ''
      },
      {
        'repositoryId': 'repo_id2',
        'openaireId': 'oa_id2',
        'repositoryName': 'the repo name2',
        'country': 'Greece',
        'siteId': '123',
        'authenticationToken': '32846584f88f30easdfasdfa',
        'creationDate':  new Date(2018, 1, 4),
        'requestorName': 'Bla blabla',
        'requestorEmail': 'blabla2@gmail.com',
        'validated': true,
        'validationDate':  new Date(2018, 1, 4),
        'comment' : ''
      },
      {
        'repositoryId': 'repo_id3',
        'openaireId': 'oa_id',
        'repositoryName': 'the repo name',
        'country': 'Greece',
        'siteId': '123',
        'authenticationToken': '32846584f571be9b57488bf4088f30ea',
        'creationDate': new Date(2018, 1, 3),
        'requestorName': 'Bla blabla',
        'requestorEmail': 'blabla2@gmail.com',
        'validated': false,
        'validationDate': new Date(2018, 1, 3),
        'comment' : ''
      }
    ]
/*
    this.showSpinner = true;
    this.loadingMessage = loadingReposMessage;
    this.repoService.getPiwikSitesForRepos()
      .subscribe(
        piwiks => this.piwiks = piwiks.sort( function(a,b){
          if(a.repositoryName<b.repositoryName){
            return -1;
          } else if(a.repositoryName>b.repositoryName){
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          console.log(error);
          this.showSpinner = false;
          this.loadingMessage = '';
          this.errorMessage = reposRetrievalError;
        },
        () => {
          this.showSpinner = false;
          this.loadingMessage = '';
        }
      );
*/
  }

  /*NOT SURE IF THESE PARAMETERS ARE THE CORRECT ONES*/
  confirmApproval(repoId: string) {
    this.confirmApprovalModal.ids = [repoId];
    this.confirmApprovalModal.showModal();
  }

  confirmedApproval(ids: string[]){
    let id = ids[0];
    console.log(`approved validation of piwik for repo with id: ${id}`);
  }

}
